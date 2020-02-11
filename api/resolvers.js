const { GraphQLScalarType, Kind } = require('graphql');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const adminPass = "adminPassword";


const dateScalarType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date object',
    parseValue(value) {
        return value;
    },
    serialize(value) {
        //console.log('serialize');
        var mom = moment(value);
        value = mom.format('DD.MM.YYYY');
        return value;
    },
    parseLiteral(ast) {
        //console.log(ast.value);
        var mom = moment(ast.value, "DD.MM.YYYY");
        var value = mom.format('YYYY-MM-DD');
        return value;
    }
});

const dateTimeScalarType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date object',
    parseValue(value) {
        return value;
    },
    serialize(value) {
        var mom = moment(value);
        value = mom.format('DD.MM.YYYY HH:mm:ss');
        return value;
    },
    parseLiteral(ast) {
        var mom = moment(ast.value, "DD.MM.YYYY HH:mm:ss");
        var value = mom.format('YYYY-MM-DD HH:mm:ss');
        return value;
    }
});

class Resolvers {
    constructor(db_ref) {
        this.db = db_ref;
        var db = db_ref;
        this.resolvers = {
            Date: dateScalarType,
            DateTime: dateTimeScalarType,
            Query: {
                books: () => { return db.select(`SELECT * FROM book`) },
                clients: () => { return db.select(`SELECT * FROM clients`) },
                publishers: () => { return db.select(`SELECT * FROM publishers`) },
                libraries: () => { return db.select(`SELECT * FROM libraries`) },
                authors: () => { return db.select(`SELECT * FROM authors`) },

                book: (parent, args) => { return db.selectOne(`SELECT * FROM book WHERE "ID" = ${args['id']}`) },
                client: (parent, args) => { return db.selectOne(`SELECT * FROM clients WHERE "ID" = ${args['id']}`) },
                publisher: (parent, args) => { return db.selectOne(`SELECT * FROM publishers WHERE "ID" = ${args['id']}`) },
                library: (parent, args) => { return db.selectOne(`SELECT * FROM libraries WHERE "ID" = ${args['id']}`) },
                author: (parent, args) => { return db.selectOne(`SELECT * FROM authors WHERE "ID" = ${args['id']}`) },
            },
            Mutation: {
                addBook: addBook_resolver,
                updateBook: updateBook_resolver,
                deleteBook: deleteBook_resolver,

                addClient: addClient_resolver,
                updateClient: updateClient_resolver,
                deleteClient: deleteClient_resolver,
                
                addPublisher: addPublisher_resolver,
                updatePublisher: updatePublisher_resolver,
                deletePublisher: deletePublisher_resolver,

                addLibrary: addLibrary_resolver,
                updateLibrary: updateLibrary_resolver,
                deleteLibrary: deleteLibrary_resolver,

                addAuthor: addAuthor_resolver,
                updateAuthor: updateAuthor_resolver,
                deleteAuthor: deleteAuthor_resolver,

                takeBook: takeBook_resolver,
                releaseBook: releaseBook_resolver,
            },
            Book: {
                owner: async (parent) => {
                    return db.selectOne(`SELECT * FROM clients WHERE "ID" = '${parent._ownerID}'`);
                },
                author: async (parent) => {
                    return db.selectOne(`SELECT * FROM authors WHERE "ID" = '${parent._authorID}'`);
                },
                library: async (parent) => {
                    return db.selectOne(`SELECT * FROM libraries WHERE "ID" = '${parent._libraryID}'`);
                },
                publisher: async (parent) => {
                    return db.selectOne(`SELECT * FROM publishers WHERE "ID" = '${parent._publisherID}'`);
                },
            },
            Client: {
                books: async (parent) => {
                    return db.select(`SELECT * FROM book WHERE "_ownerID" = '${parent.ID}'`);
                },
            },
            Author: {
                books: async (parent) => {
                    return db.select(`SELECT * FROM book WHERE "_authorID" = '${parent.ID}'`);
                },
            },
            Library: {
                books: async (parent) => {
                    return db.select(`SELECT * FROM book WHERE "_libraryID" = '${parent.ID}'`);
                },
            },
            Publisher: {
                books: async (parent) => {
                    return db.select(`SELECT * FROM book WHERE "_publisherID" = '${parent.ID}'`);
                },
            }
        };


        function addBook_resolver (_, { devKey, data }){
            if (devKey != adminPass) {
                return false;
            }

            const table = "book";

            var keys = '"'+Object.keys(data).join('","')+'"';
            var placeholders = [];
            for (let index = 0; index < Object.keys(data).length; index++) {
                placeholders.push("$"+(index+1))
            }
            placeholders = placeholders.join(',');
            var values = Object.values(data);

            var sql = `INSERT INTO "${table}" (${keys},"status")  VALUES (${placeholders},'stock') RETURNING "ID";`;
            return db.insert(sql, values).then((id) => {
                return id;
            });
        }

        function updateBook_resolver (_, { devKey, data, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "book";

            var sql = [];
            var sql_data = [];
            var num = 1;
            for (var prop in data) {
                sql.push('"' + prop + `" = \$${num++}`);
                sql_data.push(data[prop]);
            }
            sql_data.push(id);
            sql = sql.join(',');

            db.exec(`UPDATE ${table} SET ${sql} WHERE "ID" = \$${num++}`, sql_data)
            return { status: true, log: "Информация о книге изменена" };
        }

        function deleteBook_resolver (_, { devKey, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "book";

            db.exec(`DELETE FROM "${table}" WHERE "ID" = $1`, [id]);
            return { status: true, log: "Книга успешно удалена" };
        }

        /* ----------------------------------------------------- */

        function addClient_resolver (_, { devKey, data }){
            if (devKey != adminPass) {
                return false;
            }

            const table = "clients";

            var keys = '"'+Object.keys(data).join('","')+'"';
            var placeholders = [];
            for (let index = 0; index < Object.keys(data).length; index++) {
                placeholders.push("$"+(index+1))
            }
            placeholders = placeholders.join(',');
            var values = Object.values(data);

            var sql = `INSERT INTO "${table}" (${keys})  VALUES (${placeholders}) RETURNING "ID";`;
            return db.insert(sql, values).then((id) => {
                return id;
            });
        }

        function updateClient_resolver (_, { devKey, data, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "clients";

            var sql = [];
            var sql_data = [];
            var num = 1;
            for (var prop in data) {
                sql.push('"' + prop + `" = \$${num++}`);
                sql_data.push(data[prop]);
            }
            sql_data.push(id);
            sql = sql.join(',');

            db.exec(`UPDATE ${table} SET ${sql} WHERE "ID" = \$${num++}`, sql_data)
            return { status: true, log: "Информация о клиенте изменена" };
        }

        function deleteClient_resolver (_, { devKey, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "clients";

            db.exec(`DELETE FROM "${table}" WHERE "ID" = $1`, [id]);
            return { status: true, log: "Клиент успешно удалён" };
        }

        /* -------------------------------------------------------------- */

        function addPublisher_resolver (_, { devKey, data }){
            if (devKey != adminPass) {
                return false;
            }

            const table = "publishers";

            var keys = '"'+Object.keys(data).join('","')+'"';
            var placeholders = [];
            for (let index = 0; index < Object.keys(data).length; index++) {
                placeholders.push("$"+(index+1))
            }
            placeholders = placeholders.join(',');
            var values = Object.values(data);

            var sql = `INSERT INTO "${table}" (${keys})  VALUES (${placeholders}) RETURNING "ID";`;
            return db.insert(sql, values).then((id) => {
                return id;
            });
        }

        function updatePublisher_resolver (_, { devKey, data, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "publishers";

            var sql = [];
            var sql_data = [];
            var num = 1;
            for (var prop in data) {
                sql.push('"' + prop + `" = \$${num++}`);
                sql_data.push(data[prop]);
            }
            sql_data.push(id);
            sql = sql.join(',');

            db.exec(`UPDATE ${table} SET ${sql} WHERE "ID" = \$${num++}`, sql_data)
            return { status: true, log: "Информация об издателе изменена" };
        }

        function deletePublisher_resolver (_, { devKey, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "publishers";

            db.exec(`DELETE FROM "${table}" WHERE "ID" = $1`, [id]);
            return { status: true, log: "Издатель успешно удалён" };
        }

        /* -------------------------------------------------------------- */

        function addLibrary_resolver (_, { devKey, data }){
            if (devKey != adminPass) {
                return false;
            }

            const table = "libraries";

            var keys = '"'+Object.keys(data).join('","')+'"';
            var placeholders = [];
            for (let index = 0; index < Object.keys(data).length; index++) {
                placeholders.push("$"+(index+1))
            }
            placeholders = placeholders.join(',');
            var values = Object.values(data);

            var sql = `INSERT INTO "${table}" (${keys})  VALUES (${placeholders}) RETURNING "ID";`;
            return db.insert(sql, values).then((id) => {
                return id;
            });
        }

        function updateLibrary_resolver (_, { devKey, data, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "libraries";

            var sql = [];
            var sql_data = [];
            var num = 1;
            for (var prop in data) {
                sql.push('"' + prop + `" = \$${num++}`);
                sql_data.push(data[prop]);
            }
            sql_data.push(id);
            sql = sql.join(',');

            db.exec(`UPDATE ${table} SET ${sql} WHERE "ID" = \$${num++}`, sql_data)
            return { status: true, log: "Информация о библиотеке изменена" };
        }

        function deleteLibrary_resolver (_, { devKey, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "libraries";

            db.exec(`DELETE FROM "${table}" WHERE "ID" = $1`, [id]);
            return { status: true, log: "Библиотека успешно удалена" };
        }

        /* -------------------------------------------------------------- */

        function addAuthor_resolver (_, { devKey, data }){
            if (devKey != adminPass) {
                return false;
            }

            const table = "authors";

            var keys = '"'+Object.keys(data).join('","')+'"';
            var placeholders = [];
            for (let index = 0; index < Object.keys(data).length; index++) {
                placeholders.push("$"+(index+1))
            }
            placeholders = placeholders.join(',');
            var values = Object.values(data);

            var sql = `INSERT INTO "${table}" (${keys})  VALUES (${placeholders}) RETURNING "ID";`;
            return db.insert(sql, values).then((id) => {
                return id;
            });
        }

        function updateAuthor_resolver (_, { devKey, data, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "authors";

            var sql = [];
            var sql_data = [];
            var num = 1;
            for (var prop in data) {
                sql.push('"' + prop + `" = \$${num++}`);
                sql_data.push(data[prop]);
            }
            sql_data.push(id);
            sql = sql.join(',');

            db.exec(`UPDATE ${table} SET ${sql} WHERE "ID" = \$${num++}`, sql_data)
            return { status: true, log: "Информация о писателе изменена" };
        }

        function deleteAuthor_resolver (_, { devKey, id }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            const table = "authors";

            db.exec(`DELETE FROM "${table}" WHERE "ID" = $1`, [id]);
            return { status: true, log: "Писатель успешно удалён" };
        }

        /* -------------------------------------------------------------- */

        function takeBook_resolver (_, { devKey, client, book }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            db.exec(`UPDATE book SET "status" = 'hands', "_ownerID" = $1 WHERE "ID" = $2`, [client, book])
            return { status: true, log: `Книга ${book} отдана клиенту ${client}` };
        }

        function releaseBook_resolver (_, { devKey, book }){
            if (devKey != adminPass) {
                return { status: false, log: "Неверный код доступа" };
            }

            db.exec(`UPDATE book SET "status" = 'stock', "_ownerID" = null WHERE "ID" = $1`, [book])
            return { status: true, log: "Книга возвращена в библиотеку" };
        }

      

    }
}

module.exports = Resolvers;
const client = new Apollo.lib.ApolloClient({
  networkInterface: Apollo.lib.createNetworkInterface({
    uri: 'http://127.0.0.1:4000/graphql',
    transportBatching: false,
  }),
  connectToDevTools: true,
})

function parseHTML(html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t.content.cloneNode(true);
}


/* -------------------------------------- */


function addClient(form) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation addClient($name: String!, $email: String!, $phone: String!){
    addClient(
      devKey:"adminPassword"
      data:{
        name: $name
        email: $email
        phone: $phone
      }
    )
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    }
  })
    .then(data => {
      console.log(data.data.addClient);

      if (data.data.addClient > 0) location.reload()
      else alert("Что-то пошло не так");
    })
    .catch(error => {
      alert(error);
    });

}

function saveClient(form, id) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation updateClient($ID: ID!, $name: String!, $email: String!, $phone: String!){
    updateClient(
      id: $ID
      devKey:"adminPassword"
      data:{
        name: $name
        email: $email
        phone: $phone
      }
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      ID: Number(id),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    }
  })
    .then(data => {
      console.log(data.data.updateClient);

      if (data.data.updateClient.status == true) { setTimeout(() => { location.reload() }, 500) }
      else alert(data.data.updateClient.log);
    })
    .catch(error => {
      alert(error);
    });

}


function delClient(id) {

  const QUERY = Apollo.gql`
  mutation deleteClient($ID: ID!){
    deleteClient(
      devKey:"adminPassword"
      id: $ID
    ){
      status
      log
    }
  }
  `;

  if (confirm("Вы точно хотите удалить этого клиента?")) {

    client.mutate({
      mutation: QUERY,
      variables: {
        ID: id
      }
    })
      .then(data => {
        console.log(data.data.deleteClient);

        if (data.data.deleteClient.status == true) location.reload()
        else alert(data.data.deleteClient.log);
      })
      .catch(error => {
        alert(error);
      });
  }

}


function editClient(id, name, email, phone) {

  var overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = (e) => {
    if (e.toElement == overlay) {
      overlay.remove()
    }
  }

  var overlay_body = parseHTML(`
  <div class='card'>
    <div class='head'>
      Изменение клиента
    </div>
    <div class='body'>
      <form onsubmit="saveClient(this, ${id}); return false;">
        <div class="row mb-2">
          <div class="col-6">
            <input class="input" name="name" type="text" placeholder="Имя.." required="" value="${name}">
          </div>
          <div class="col-6">
            <input class="input" name="email" type="text" placeholder="Почта.." required="" value="${email}">
          </div></div><div class="row mb-2">
          <div class="col-12">
            <input class="input" name="phone" type="text" placeholder="Телефон.." required="" value="${phone}">
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <button class="btn btn__red" style="width:100%" type="reset" value="Reset">Очистить</button>
          </div>
          <div class="col-3 offset-6">
            <button class="btn btn__blue" style="width:100%" type="submit" value="Submit">Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `)
  overlay.appendChild(overlay_body)


  document.body.appendChild(overlay)
}


/* -------------------------------------- */


function addPublisher(form) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation addPublisher($name: String!, $address: String!){
    addPublisher(
      devKey:"adminPassword"
      data:{
        name: $name
        address: $address
      }
    )
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      name: formData.get('name'),
      address: formData.get('address'),
    }
  })
    .then(data => {
      console.log(data.data.addPublisher);

      if (data.data.addPublisher > 0) location.reload()
      else alert("Что-то пошло не так");
    })
    .catch(error => {
      alert(error);
    });

}

function savePublisher(form, id) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation updatePublisher($ID: ID!, $name: String!, $address: String!){
    updatePublisher(
      id: $ID
      devKey:"adminPassword"
      data:{
        name: $name
        address: $address
      }
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      ID: Number(id),
      name: formData.get('name'),
      address: formData.get('address'),
    }
  })
    .then(data => {
      console.log(data.data.updatePublisher);

      if (data.data.updatePublisher.status == true) { setTimeout(() => { location.reload() }, 500) }
      else alert(data.data.updatePublisher.log);
    })
    .catch(error => {
      alert(error);
    });

}


function delPublisher(id) {

  const QUERY = Apollo.gql`
  mutation deletePublisher($ID: ID!){
    deletePublisher(
      devKey:"adminPassword"
      id: $ID
    ){
      status
      log
    }
  }
  `;

  if (confirm("Вы точно хотите удалить этого издателя?")) {

    client.mutate({
      mutation: QUERY,
      variables: {
        ID: id
      }
    })
      .then(data => {
        console.log(data.data.deletePublisher);

        if (data.data.deletePublisher.status == true) location.reload()
        else alert(data.data.deletePublisher.log);
      })
      .catch(error => {
        alert(error);
      });
  }

}


function editPublisher(id, name, address) {

  var overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = (e) => {
    if (e.toElement == overlay) {
      overlay.remove()
    }
  }

  var overlay_body = parseHTML(`
  <div class='card'>
    <div class='head'>
      Изменение издателя
    </div>
    <div class='body'>
      <form onsubmit="savePublisher(this, ${id}); return false;">
        <div class="row mb-2">
          <div class="col-6">
            <input class="input" name="name" type="text" placeholder="Имя.." required="" value="${name}">
          </div>
          <div class="col-6">
            <input class="input" name="address" type="text" placeholder="Адрес.." required="" value="${address}">
          </div></div><div class="row mb-2">
        </div>
        <div class="row">
          <div class="col-3">
            <button class="btn btn__red" style="width:100%" type="reset" value="Reset">Очистить</button>
          </div>
          <div class="col-3 offset-6">
            <button class="btn btn__blue" style="width:100%" type="submit" value="Submit">Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `)
  overlay.appendChild(overlay_body)


  document.body.appendChild(overlay)
}


/* -------------------------------------- */


function addAuthor(form) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation addAuthor($name: String!, $birth: Date!){
    addAuthor(
      devKey:"adminPassword"
      data:{
        name: $name
        birth: $birth
      }
    )
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      name: formData.get('name'),
      birth: formData.get('birth'),
    }
  })
    .then(data => {
      console.log(data.data.addAuthor);

      if (data.data.addAuthor > 0) location.reload()
      else alert("Что-то пошло не так");
    })
    .catch(error => {
      alert(error);
    });

}

function saveAuthor(form, id) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation updateAuthor($ID: ID!, $name: String!, $birth: Date!){
    updateAuthor(
      id: $ID
      devKey:"adminPassword"
      data:{
        name: $name
        birth: $birth
      }
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      ID: Number(id),
      name: formData.get('name'),
      birth: formData.get('birth'),
    }
  })
    .then(data => {
      console.log(data.data.updateAuthor);

      if (data.data.updateAuthor.status == true) { setTimeout(() => { location.reload() }, 500) }
      else alert(data.data.updateAuthor.log);
    })
    .catch(error => {
      alert(error);
    });

}


function delAuthor(id) {

  const QUERY = Apollo.gql`
  mutation deleteAuthor($ID: ID!){
    deleteAuthor(
      devKey:"adminPassword"
      id: $ID
    ){
      status
      log
    }
  }
  `;

  if (confirm("Вы точно хотите удалить этого писателя?")) {

    client.mutate({
      mutation: QUERY,
      variables: {
        ID: id
      }
    })
      .then(data => {
        console.log(data.data.deleteAuthor);

        if (data.data.deleteAuthor.status == true) location.reload()
        else alert(data.data.deleteAuthor.log);
      })
      .catch(error => {
        alert(error);
      });
  }

}


function editAuthor(id, name, birth) {

  var overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = (e) => {
    if (e.toElement == overlay) {
      overlay.remove()
    }
  }

  var overlay_body = parseHTML(`
  <div class='card'>
    <div class='head'>
      Изменение писателя
    </div>
    <div class='body'>
      <form onsubmit="saveAuthor(this, ${id}); return false;">
        <div class="row mb-2">
          <div class="col-6">
            <input class="input" name="name" type="text" placeholder="Имя.." required="" value="${name}">
          </div>
          <div class="col-6">
            <input class="input" name="birth" type="text" placeholder="Дата рождения.." required="" value="${birth}">
          </div></div><div class="row mb-2">
        </div>
        <div class="row">
          <div class="col-3">
            <button class="btn btn__red" style="width:100%" type="reset" value="Reset">Очистить</button>
          </div>
          <div class="col-3 offset-6">
            <button class="btn btn__blue" style="width:100%" type="submit" value="Submit">Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `)
  overlay.appendChild(overlay_body)


  document.body.appendChild(overlay)
}

/* -------------------------------------- */


function addLibrary(form) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation addLibrary($email: String!, $phone: String!, $address: String!){
    addLibrary(
      devKey:"adminPassword"
      data:{
        email: $email
        phone: $phone
        address: $address
      }
    )
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    }
  })
    .then(data => {
      console.log(data.data.addLibrary);

      if (data.data.addLibrary > 0) location.reload()
      else alert("Что-то пошло не так");
    })
    .catch(error => {
      alert(error);
    });

}

function saveLibrary(form, id) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation updateLibrary($ID: ID!, $email: String!, $phone: String!, $address: String!){
    updateLibrary(
      id: $ID
      devKey:"adminPassword"
      data:{
        email: $email
        phone: $phone
        address: $address
      }
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      ID: Number(id),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    }
  })
    .then(data => {
      console.log(data.data.updateLibrary);

      if (data.data.updateLibrary.status == true) { setTimeout(() => { location.reload() }, 500) }
      else alert(data.data.updateLibrary.log);
    })
    .catch(error => {
      alert(error);
    });

}


function delLibrary(id) {

  const QUERY = Apollo.gql`
  mutation deleteLibrary($ID: ID!){
    deleteLibrary(
      devKey:"adminPassword"
      id: $ID
    ){
      status
      log
    }
  }
  `;

  if (confirm("Вы точно хотите удалить эту библиотеку?")) {

    client.mutate({
      mutation: QUERY,
      variables: {
        ID: id
      }
    })
      .then(data => {
        console.log(data.data.deleteLibrary);

        if (data.data.deleteLibrary.status == true) location.reload()
        else alert(data.data.deleteLibrary.log);
      })
      .catch(error => {
        alert(error);
      });
  }

}


function editLibrary(id, email, phone, address) {

  var overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = (e) => {
    if (e.toElement == overlay) {
      overlay.remove()
    }
  }

  var overlay_body = parseHTML(`
  <div class='card'>
    <div class='head'>
      Изменение библиотеки
    </div>
    <div class='body'>
      <form onsubmit="saveLibrary(this, ${id}); return false;">
        <div class="row mb-2">
          <div class="col-6">
            <input class="input" name="email" type="text" placeholder="Почта.." required="" value="${email}">
          </div>
          <div class="col-6">
            <input class="input" name="phone" type="text" placeholder="Телефон.." required="" value="${phone}">
          </div></div><div class="row mb-2">
        </div>
        <div class="row mb-2">
          <div class="col-12">
            <input class="input" name="address" type="text" placeholder="Адрес.." required="" value="${address}">
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <button class="btn btn__red" style="width:100%" type="reset" value="Reset">Очистить</button>
          </div>
          <div class="col-3 offset-6">
            <button class="btn btn__blue" style="width:100%" type="submit" value="Submit">Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `)
  overlay.appendChild(overlay_body)


  document.body.appendChild(overlay)
}

/* -------------------------------------- */


function addBook(form) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation addBook($_publisherID: ID!, $_authorID: ID!, $_libraryID: ID!, $name: String!, $date: Date!){
    addBook(
      devKey:"adminPassword"
      data:{
        _publisherID: $_publisherID
        _authorID: $_authorID
        _libraryID: $_libraryID

        name: $name
        date: $date
      }
    )
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      _publisherID: Number(formData.get('_publisherID')),
      _authorID: Number(formData.get('_authorID')),
      _libraryID: Number(formData.get('_libraryID')),

      name: formData.get('name'),
      date: formData.get('date'),
    }
  })
    .then(data => {
      console.log(data.data.addBook);

      if (data.data.addBook > 0) location.reload()
      else alert("Что-то пошло не так");
    })
    .catch(error => {
      alert(error);
    });

}

function saveBook(form, id) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation updateBook($ID: ID!, $name: String!, $date: Date!){
    updateBook(
      id: $ID
      devKey:"adminPassword"
      data:{
        name: $name
        date: $date
      }
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      ID: Number(id),
      name: formData.get('name'),
      date: formData.get('date'),
    }
  })
    .then(data => {
      console.log(data.data.updateBook);

      if (data.data.updateBook.status == true) { setTimeout(() => { location.reload() }, 500) }
      else alert(data.data.updateBook.log);
    })
    .catch(error => {
      alert(error);
    });

}


function delBook(id) {

  const QUERY = Apollo.gql`
  mutation deleteBook($ID: ID!){
    deleteBook(
      devKey:"adminPassword"
      id: $ID
    ){
      status
      log
    }
  }
  `;

  if (confirm("Вы точно хотите удалить эту книгу?")) {

    client.mutate({
      mutation: QUERY,
      variables: {
        ID: id
      }
    })
      .then(data => {
        console.log(data.data.deleteBook);

        if (data.data.deleteBook.status == true) location.reload()
        else alert(data.data.deleteBook.log);
      })
      .catch(error => {
        alert(error);
      });
  }

}


function editBook(id, name, date) {

  var overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = (e) => {
    if (e.toElement == overlay) {
      overlay.remove()
    }
  }

  var overlay_body = parseHTML(`
  <div class='card'>
    <div class='head'>
      Изменение библиотеки
    </div>
    <div class='body'>
      <form onsubmit="saveBook(this, ${id}); return false;">
        <div class="row mb-2">
          <div class="col-6">
            <input class="input" name="name" type="text" placeholder="Название.." required="" value="${name}">
          </div>
          <div class="col-6">
            <input class="input" name="date" type="text" placeholder="Дата издания.." required="" value="${date}">
          </div></div><div class="row mb-2">
        </div>
        <div class="row">
          <div class="col-3">
            <button class="btn btn__red" style="width:100%" type="reset" value="Reset">Очистить</button>
          </div>
          <div class="col-3 offset-6">
            <button class="btn btn__blue" style="width:100%" type="submit" value="Submit">Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `)
  overlay.appendChild(overlay_body)


  document.body.appendChild(overlay)
}

function takeBookHud(id) {

  var overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = (e) => {
    if (e.toElement == overlay) {
      overlay.remove()
    }
  }

  var users_list = document.querySelector('#users_list');
  users_list = users_list.innerHTML;

  var overlay_body = parseHTML(`
  <div class='card'>
    <div class='head'>
      Изменение библиотеки
    </div>
    <div class='body'>
      <form onsubmit="takeBook(${id}, this); return false;">
        <div class="row mb-2">
          <div class="col-12" style='min-width: 600px'>
            ${users_list}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <button class="btn btn__blue" style="width:100%" type="submit" value="Submit">Выдать книгу</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `)
  overlay.appendChild(overlay_body)


  document.body.appendChild(overlay)
}

/* ---------------------------------------------------------- */

function booksInLibrary(id) {
  const QUERY = Apollo.gql`
  query ($ID: Int!){
    library(id: $ID){
      books{
        ID
        name
      }
    }
  }
  `;

  client.query({
    query: QUERY,
    variables: {
      ID: Number(id)
    }
  })
    .then(data => {

      var container = document.querySelector('#booksOnHands');
      
      var tableBody = "";
      data.data.library.books.forEach(element => {
        tableBody += `
        <tr>
          <td>${element.ID}</td>
          <td>${element.name}</td>
          <td class='action'><img class="mr-2" src="/icons/delete.svg" onclick="releaseBook(${id}, ${element.ID})"></td>
        </tr>
        `
      });

      var table = parseHTML(`
      <table>
        <tr>
          <td>ID</td>
          <td>Название</td>
          <td></td>
        </tr>
        ${tableBody}
      </table>
      `)

      container.innerHTML = "";
      container.append(table);
    })
    .catch(error => {
      alert(error);
    });

}


function booksOfAuthor(id) {
  const QUERY = Apollo.gql`
  query ($ID: Int!){
    author(id: $ID){
      books{
        ID
        name
      }
    }
  }
  `;

  client.query({
    query: QUERY,
    variables: {
      ID: Number(id)
    }
  })
    .then(data => {

      var container = document.querySelector('#booksOnHands');
      
      var tableBody = "";
      data.data.author.books.forEach(element => {
        tableBody += `
        <tr>
          <td>${element.ID}</td>
          <td>${element.name}</td>
          <td class='action'><img class="mr-2" src="/icons/delete.svg" onclick="releaseBook(${id}, ${element.ID})"></td>
        </tr>
        `
      });

      var table = parseHTML(`
      <table>
        <tr>
          <td>ID</td>
          <td>Название</td>
          <td></td>
        </tr>
        ${tableBody}
      </table>
      `)

      container.innerHTML = "";
      container.append(table);
    })
    .catch(error => {
      alert(error);
    });

}


function booksOfPublisher(id) {
  const QUERY = Apollo.gql`
  query ($ID: Int!){
    publisher(id: $ID){
      books{
        ID
        name
      }
    }
  }
  `;

  client.query({
    query: QUERY,
    variables: {
      ID: Number(id)
    }
  })
    .then(data => {

      var container = document.querySelector('#booksOnHands');
      
      var tableBody = "";
      data.data.publisher.books.forEach(element => {
        tableBody += `
        <tr>
          <td>${element.ID}</td>
          <td>${element.name}</td>
          <td class='action'><img class="mr-2" src="/icons/delete.svg" onclick="releaseBook(${id}, ${element.ID})"></td>
        </tr>
        `
      });

      var table = parseHTML(`
      <table>
        <tr>
          <td>ID</td>
          <td>Название</td>
          <td></td>
        </tr>
        ${tableBody}
      </table>
      `)

      container.innerHTML = "";
      container.append(table);
    })
    .catch(error => {
      alert(error);
    });

}

function booksOnHands(id) {
  const QUERY = Apollo.gql`
  query ($ID: Int!){
    client(id: $ID){
      books{
        ID
        name
      }
    }
  }
  `;

  client.query({
    query: QUERY,
    variables: {
      ID: Number(id)
    }
  })
    .then(data => {

      var container = document.querySelector('#booksOnHands');
      
      var tableBody = "";
      data.data.client.books.forEach(element => {
        tableBody += `
        <tr>
          <td>${element.ID}</td>
          <td>${element.name}</td>
          <td class='action'><img class="mr-2" src="/icons/delete.svg" onclick="releaseBook(${id}, ${element.ID})"></td>
        </tr>
        `
      });

      var table = parseHTML(`
      <table>
        <tr>
          <td>ID</td>
          <td>Название</td>
          <td></td>
        </tr>
        ${tableBody}
      </table>
      `)

      container.innerHTML = "";
      container.append(table);
    })
    .catch(error => {
      alert(error);
    });

}

function takeBook(ID, form) {
  var formData = new FormData(form);

  const QUERY = Apollo.gql`
  mutation takeBook($book: ID!, $client: ID!){
    takeBook(
      devKey: "adminPassword"
      book: $book
      client: $client
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      book: Number(ID),
      client: Number(formData.get('_clientID')),
    }
  })
    .then(data => {
      if (data.data.takeBook.status == true) {
        alert(data.data.takeBook.log);
        location.reload()
      }
        else alert(data.data.takeBook.log);
    })
    .catch(error => {
      alert(error);
    });
}

function releaseBook(clientID, book) {


  const QUERY = Apollo.gql`
  mutation releaseBook($book: ID!){
    releaseBook(
      devKey: "adminPassword"
      book: $book
    ){
      status
      log
    }
  }
  `;


  client.mutate({
    mutation: QUERY,
    variables: {
      book: Number(book),
    }
  })
    .then(data => {
      if (data.data.releaseBook.status == true) {
        alert(data.data.releaseBook.log);
        location.reload()
      }
        else alert(data.data.releaseBook.log);
      })
    .catch(error => {
      alert(error);
    });
}
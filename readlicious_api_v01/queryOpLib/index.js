const axios = require('axios');


module.exports = async function (context, req) {
    
   // if(req.body

/*
 "http://openlibrary.org/search.json?title={title}"
 "http://openlibrary.org/search.json?author={author_name}"
 "http://openlibrary.org/search.json?q={string}"
    "(https://openlibrary.org/"

GET {url}/works/{w_key}.json
Devolve os detalhes de uma obra, em que w_key é o identificador da mesma.
  
GET {url}/books/{b_key}.json
Devolve os detalhes de uma edição de uma obra, em que b_key é o identificador dessa edição.
  
GET {url}/isbn/{isbn}.json
Devolve detalhes de um livro (edição de uma obra) pelo isbn.
  
GET {url}/authors/{a_key}.json
Devolve os detalhes de um autor, em que a_key é o identificador.
  
GET {url}/authors/{a_key}/works.json

Para capas e fotos de autores
capas
https://covers.openlibrary.org/b/$key/$value-$size.jpg Onde:
  • • •
key pode ser ISBN, ID, entre outros, para indicar o tipo de código,
value é o valor do código escolhido,
size pode ser S, M and L, indica o tamanho conforme acima mencionado.

Author photos can be accessed using OLID and ID.

The URL Pattern for accessing author photos is:

https://covers.openlibrary.org/a/$key/$value-$size.jpg

*/

    let url = "http://openlibrary.org/search.json?title={title}";
    /*
    let response = await axios.get(url);

    console.log(response.data);
    */
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: req
    };
}
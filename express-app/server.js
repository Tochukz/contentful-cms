const express = require('express');
const contentful = require('contentful');
require('dotenv').config();

const app = express();
app.set('port', process.env.PORT);

const client  = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.CONTENT_DELIVERY_ACCESS_TOKEN,
  environment: 'dev', // defaults to master
  
});

/** Get a single entity */
app.get('/get-entry', (req, res) => {
    // The entry_id is the string after the entries url segment of the entry's page
    client.getEntry('4pnMIK5gPO8rjk0qpYFCJJ')
          .then(entry => {
            return res.json(entry);
          }).catch(err => {         
            console.log('getEntry: ', err)
            return res.json(err);
          });
});

/** Get all entities from all content types */
app.get('/get-entries', (req, res) => {
    client.getEntries()
          .then(entries => {
            const fieldsArray = entries.items.map(entry => entry.fields);
            return res.json(fieldsArray);
          }).catch(err => {
              console.log(err);
              return res.json(err);
          });
})

/** Returns entries of a given content type. 
 * For example books /content-type/books or laptop /content-type/laptop or tool*/
app.get('/content-types/:type', (req, res) => {
    const type = req.params.type;
    console.log('type', type);
    client.getEntries({
        'content_type': type
    }).then(entries => {
         const entities = entries.items.map(item => item.fields);
         return res.json(entities);
    }).catch(err => {
        console.log(err);
        return res.json(err);
    })
});

/** Filter by properties of entries  
 * For example /books/language, /books/framework or /books/tool
*/
app.get('/books/:category', (req, res) => {
    const category = req.params.category;
    client.getEntries({
        'content_type': 'books',
        'fields.category': category
    }).then(entries => {
        const entities = entries.items.map(item => item.fields);
        return res.json(entities);
    }).catch(err => {
        console.log(err);
        return res.json(err);
    })
});

/** You can use the 'not equal' [ne] operator to filter a specific field out of the collection
 * FOr example /laptops/Dell will return all but the Dell laptop brands
 */
app.get('/laptops/:notBrand', (req, res) => {
   const notBrand = req.params.notBrand;
   client.getEntries({
       'content_type': 'laptop',
       'fields.manufacturer[ne]': notBrand
   }).then(entries => {
       const entities = entries.items.map(item => item.fields);
       return res.json(entities);
   }).catch(err => {
       console.log(err);
       return res.json(err);
   });
});
app.listen(app.get('port'), () => console.log(`Server is running on port ${app.get('port')}`));
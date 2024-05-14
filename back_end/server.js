const express = require('express')
const app = express()


app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('welcomepage')
});// put welcome page here later

app.get('/index', (req, res) => {
    res.render('index')
}
);

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}); // put later in main func with db connection


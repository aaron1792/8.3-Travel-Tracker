import pg from 'pg';
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const db= new pg.Client({
  user:'username',
  host:'localhost',database:'mydatabase',
  password:'password',
  port:5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query ('SELECT country_code FROM visited_countries');
  let countries = [];
  result.rows.forEach((country)=>{
  country.push(country.country_code)

  })

  res.render('index.js', {countries: countries, total: countries.length} )
console.log(result.rows)
db.end()
});

app.post('/add', async (req,res) => {
const input = req.body['country'];

const result = await db.query ('SELECT country_code from countries WHERE country_name = $1',
  [input]
)
if (result.rows.length !== 0) {
  const data = result.rows[0];
  const countryCode = data.country_code;

  await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
    countryCode,
  ]);
  res.redirect("/");
}} )

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

<p align="center">
  <h1 align="center">GRUD Node.js and Postgres API</h1>
</p>

<p>
  <h2 align="center">Endpoints Documentation</h2>

  <h3>Home <a href="http://localhost:4000/" target="blank">localhost:4000</a> - home page, check if the server is running</h3>

  <ul>
    <li><h3><u>localhost:4000/movies</u></h3> 
      <ul>
        <li><font color="4040ff">POST</font> <br> <u>movies</u> - add movie</li><br> 
        <li><font color="green">GET</font> <br> <u>movies</u> - get all movies</li><br>
        <li><font color="green">GET</font> <br> <u>movies/:id</u> - get movie by id</li><br>
        <li><font color="green">GET</font> <br> <u>movies/genres/:id</u> - get all genres for movie by id</li><br>
        <li><font color="green">GET</font> <br> <u>movies/year/2018</u> - get all movies by year of publication</li><br>
        <li><font color="yellow">PUT</font> <br> <u>movies/:id</u> - update movie by id</li><br>
        <li><font color="red">DELETE</font> <br> <u>movies/:id</u> - delete movie by id</li><br>
      </ul>
    </li>
    <li><h3><u>localhost:4000/genres</u></h3> 
      <ul>
        <li><font color="4040ff">POST</font> <br> <u>genres</u> - add genre</li><br> 
        <li><font color="green">GET</font> <br> <u>genres</u> - get all genres</li><br>
        <li><font color="green">GET</font> <br> <u>genres/:id</u> - get genre by id</li><br>
        <li><font color="green">GET</font> <br> <u>genres/movies/comedy</u> - get all movies by genre</li><br>
        <li><font color="yellow">PUT</font> <br> <u>genres/:id</u> - update genre by id</li><br>
        <li><font color="red">DELETE</font> <br> <u>genres/:id</u> - delete genre by id</li><br>
      </ul>
    </li>
</ul>
</p>

## JSON for request body is in the UTILS folder

<hr style="height:30px">

## Downloading

```bash
git clone https://github.com/GoldenManBel/GRUD_NodeJS_Postgres.git
```

## Installing NPM modules

```bash
npm install
```

## Running application local

```bash
# watch mode
npm run start:dev 
```
or
```bash
npm start
```
<br>

## Create database use file database.sql with commands for create and insert values into tables
<br>

## The settings for connecting to the database are in .env file (you can replace them with your settings)

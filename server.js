const { app } = require('./src/routes');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app started on ${PORT}...`);
});

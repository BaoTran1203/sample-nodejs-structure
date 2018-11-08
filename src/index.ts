import app from './app/app';
require('dotenv').load();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SERVER IS LISTENNING: ${PORT}`);
});
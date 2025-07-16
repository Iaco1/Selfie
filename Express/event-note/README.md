# testare il server

per lanciare il tutto e testarlo devi fare queste cose

apri un terminale e fai

```
cd ... / mongoDB
```

(ovvero entra nella cartella dove e` presente questo README)

poi splitta il terminale in 3 (chiamati terminale A_NODE, B_MONGO, C_POSTMAN)

## terminale 1 (A_NODE)

```
node index.js
```

questo comando fa partire il codice scritto index.js
questo contiene l'entry point del server

## terminale 2 (B_MONGO)

ora dobbiamo far funzionare il comando
```
mongosh
```
fai questo comando e vedi se per caso funziona gia`
se non funziona meglio il metodo 1

### metodo 1 (usare docker)

```
sudo apt install docker.io
```
per installare il pacchetto richiesto

```
sudo docker run -d -p 27017:27017 --name NOMEDB mongo:6.0
```
per crearlo

```
sudo docker start NOMEDB
```
per restartarlo

```
sudo docker rm NOMEDB
```
per rimuoverlo

### metodo 2

```
sudo apt install mongo-dev
```
per installare il pacchetto

```
sudo systemctl enable mongod
```
per abilitiarlo
comunque tutti i comandi hanno **systemctl**
(chiedi a chatgpt per infos, questo e` quello che mi ricordo di aver provato a fare )

## postman

```
sudo apt install postman
```
installazione

```
postman > /dev/null 2>&1
```
lancio del programma (redirect stdin 1> and stderr 2> )

questo programma e` proprietario, ma avendo gia` installato proviamo a usarlo :/
chatgpt propone anche https://hoppscotch.io ,
"sudo apt install insomnia",
"sudo apt install httpie",
"curl"
ma non so come funzionano

su postman (o chi per lui)
fai una GET, POST, PUT, DELETE (pulsante)
in base a cosa hai scritto in index.js
a http://localhot:<PORTA>/<PATH_GESTITO>

ad esempio POST su porta 3002 con path /postNote
http://localhost:3002/postNote

(importante fai http non https, ovvero non ci deve essere la s di secure http)

vai nel body, raw, JSON (non text), scrivi un JSON da inserire sul dobbiamo
e fai click sul pulsante "send"

**fatto cio`** dovresti vedere i risultati sia su postman
sia sul terminale B_MONGO su mongosh

facendo i comandi

```
use selfie
```
```
db.notes.find().pretty()
```

buon divertimento e Happy Hacking

Autori:
- Davide Iacomino, 987889, davide.iacomino@studio.unibo.it
  - Contribuzioni: Homepage, Login, Signup, Account Settings, Sidebar, Notifiche, Deployment, Pomodoro, setup del database, del frontend e del backend
- Libera Longo, 839018, libera.longo@studio.unibo.it
  - Contribuzioni: ...

Organizzazione File Progetto:

  Sull'host remoto in generale:
    Sia il backend che il frontend sono eseguiti da `app.js`.

    Backend:

      Sull'host remoto c'e' una copia esatta del backend funzionale (quasi solo cio' che e' necessario per il sito), salvo per `environment.js` che specifica se ci si trova su una macchina locale (dove sviluppiamo) o sul server del DISI.
      Non ci sono vari file di test locali o usati una sola volta per generare contenuti sul database inizialmente.

      - `event-note` contiene ...
      - `models` contiene i mongoose schema per interfacciarsi con le relative collection su mongodb
      - `routes` contiene le API REST delle varie feature del progetto per operare sul database
      - `utils` contiene alcune funzionalita' utili in piu' moduli
      - `config.js` e `environment.js` sono due file che insieme modificano i dati di connessione al database in base a se si sta eseguendo il progetto in ambiente di deployment o di sviluppo

    Frontend:
      Per il frontend c'e' la build Angular dei sorgenti in `/dist`.


  In `/sources`:
    Backend:
      come sull'host remoto in generale.

    Frontend:
      - `docs`, file in UML per organizzare il progetto. fatti prima di iniziare
      - `public`, tutti gli asset: immagini e suoni principalmente
      - `/`,
        - i certificati per servire il sito su https in locale, `cert.pem`, `cert-key.pem`
        - la configurazione del service worker per le notifiche, `ngsw-config.json`
        - `proxy.conf.json` per bypassare le cors policies in locale che impediscono la comunicazione tra frontend e backend
        - `angular.json` per gestire la connessione https e il service worker
        il resto sono file autogenerati
      - `src/environments`
        - contiene essenzialmente la VAPID KEY per le notifiche
        - l'indirizzo del backend a cui fare le richieste http
      - `src/app/`
        - `auth` contiene i componenti login e signup
        - `calendar` ...
        - `events` ...
        - `homepage` contiene il componente homepage con le preview delle feature principali
        - `list-activities` ...
        - `navigation` contiene i componenti
          - header (l'header prima di fare login),
          - homeheader (l'header dopo aver fatto login),
          - sidebar
          - e success (che mostra un messaggio di riuscita/non riuscita del login/signup)
        - `notes` ...
        - `notification` e `notification-container`
          - contengono il componente 'modello' di una notifica prettamente visiva (con qualche effetto come i suoni)
          - e un il componente dove mostrare le notifiche, un overlay dove poter sovrapporre le notifiche rispetto al resto del sito
          entrambe non sono in uso in quanto sono state soppiantate dalle notifiche native al sistema operativo in uso
        - `pomodoro` contiene il componente pomodoro e un enum per le varie fasi in cui si trova il timer, come se fosse una macchina a stati
        - `services` contiene tutti i servizi del frontend maggiormente per comunicazione col backend o per comunicazione tra componenti od operazioni indipendenti dall'istanza corrente del componente
        - `settings` contiene
         - accountsettings che e' il componente che permette all'utente di modificare i dettagli del suo account e le credenziali
         - datumupdater che e' un componente riutilizzabile per mostrare un dato e modificarlo
       - `types` ...
       - `utils` ...



SCELTE IMPLEMENTATIVE

Davide ha impostato il progetto e creato uno scheletro minimale e a quel punto anche Libera ha iniziato a contribuire.
Quindi la totalita' quasi delle scelte dei linguaggi e framework e' da attribuire a Davide.

- linguaggi e framework:
  - Angular:
      Ho scelto Angular perche' ha un supporto molto comprensivo per typescript,
      perche' tante funzionalita' sono built-in (con l'idea di ridurre un po' di trial and error nel fare funzionare librerie esterne),
      perche' e' opinionato e all'inizio del progetto ho pensato che avere un solo modo di fare le cose fosse meglio che dover scegliere tra tante opzioni,
      e perche' il two-way data binding built-in e' molto comodo.
  - Bulma:
      Ho scelto Bulma per il suo look. Cercavo un'alternativa a Bootstrap che mi piacesse esteticamente.
      Ho guardato siti realizzati con i vari framework css e Bulma aveva decisamente quelli che mi piacevano di piu' e percio' l'ho scelto.
      E aveva anche una documentazione ampia e ben organizzata.
  - Mongoose:
      Scelto per la semplicita' implementativa.
  - Express:
    E' stata una scelta forzata. Visto che era l'unico framework permesso.

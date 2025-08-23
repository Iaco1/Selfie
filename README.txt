Autori:
- Davide Iacomino, 987889, davide.iacomino@studio.unibo.it
  - Contribuzioni: Homepage, Login, Signup, Account Settings, Sidebar, Notifiche, Deployment, Pomodoro, setup del database, del frontend e del backend
    [
      in particolare (fatto da Davide):
      - Homepage: la parte pomodoro
      - Notifiche (notification, notification-container notification.service)
        quindi il "how?" delle notifiche
    ]
- Libera Longo, 839018, libera.longo@studio.unibo.it
  - Contribuzioni: Timemachine, Calendario, Eventi, Activities, Note, il "when?" delle notifiche, Homepage
    [
      in particolare (fatto da Libera):
      - Homepage: la parte eventi, activities, note
      - Notifiche: (notification-handler.service)
        quindi il "when?" delle notifiche
      suddivisione in files (fatto da Libera):
        componenti:
          - Calendar (dateselect, day, month, timemachine, week, calendar),
          - events (editor-events, event),
          - List of activities (activity, list-activities),
          - notes (editor-notes, note, search-notes),
        types (models): activity.model, event.model, note.model, notification.interface, strig-date
        utils (moduli): base.service, contrast-colour.pipe, crud-helper, date, rrule-utils
        services: time-machine.service activity.service, event.service, note.service, notification-handler.service,
    ]

Organizzazione File Progetto:

  Sull'host remoto in generale:
    Sia il backend che il frontend sono eseguiti da `app.js`.

    Backend:

      Sull'host remoto c'e' una copia esatta del backend funzionale (quasi solo cio' che e' necessario per il sito), salvo per `environment.js` che specifica se ci si trova su una macchina locale (dove sviluppiamo) o sul server del DISI.
      Non ci sono vari file di test locali o usati una sola volta per generare contenuti sul database inizialmente.

      - `event-note` contiene `crud.service.js` usato per poter salvare eventi, activities e note,
          serviva per fare operazioni CRUD (Create, Read, Update, Delete) in modo generico e riutilizzabile
          `DateType` e `NotificationType` gesiscono lo schema rispettivamente per le date e le notifiche
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
        - `calendar` contiene i componenti
          - `dateselect` si occupa di selezionare una data
          - `timemachine` fa uso di `dateselect` e aggiunge il tempo, si occupa di lanciare il gestore delle notifiche (notification-handler.service)
          - `day` si occupa di visualizzare gli eventi e le activities di uno specifico giorno, permette anche di vedere gli eventi suddivisi in ore
          - `week` fa uso di `day` e si occupa di mostrare tutte gli eventi nelle varie ore della settimana
          - `month` fa uso di `day` e si occupa di mostrare in forma piu` compatta gli eventi del mese
        - `events` contiene la visualizzazione del singolo evento, e l'editor per gli eventi
          - `event` mostra data e titolo del evento e se premuto fa accedere a `editor-event`
          - `editor-event` permette di editare il singolo evento, permette inoltre di settare le ripetizioni, le notifiche e il pomodoro
        - `homepage` contiene il componente homepage con le preview delle feature principali
        - `list-activities` contiene il componente `activity` e l'elenco delle activities `list-activities`
          - `activity` mostra una checkbox di completamento, la data e il titolo dell'attivita`
          - `list-activities` mostra tutte le activity (salvate e non)
        - `navigation` contiene i componenti
          - header (l'header prima di fare login),
          - homeheader (l'header dopo aver fatto login),
          - sidebar
          - e success (che mostra un messaggio di riuscita/non riuscita del login/signup)
        - `notes` contiene i componenti
          - `note` mostra la singola nota all'interno di `search-notes`, la visualizzazione dei primi 200 caratteri del markdownd
          - `editor-notes` permette l'editing e visualizzazione dell'intero testo in markdown e sua "preview"
          - `search-notes` mostra l'elenco di `note` e permette l'ordinamento (titolo, creazione, ultima modifica, lunghezza del contenuto (e` per id di default))
        - `notification` e `notification-container`
          - contengono il componente 'modello' di una notifica prettamente visiva (con qualche effetto come i suoni)
          - e un il componente dove mostrare le notifiche, un overlay dove poter sovrapporre le notifiche rispetto al resto del sito
          entrambe non sono in uso in quanto sono state soppiantate dalle notifiche native al sistema operativo in uso
        - `pomodoro` contiene il componente pomodoro e un enum per le varie fasi in cui si trova il timer, come se fosse una macchina a stati
        - `services` contiene tutti i servizi del frontend maggiormente per comunicazione col backend o per comunicazione tra componenti od operazioni indipendenti dall'istanza corrente del componente
        - `settings` contiene
          - accountsettings che e' il componente che permette all'utente di modificare i dettagli del suo account e le credenziali
          - datumupdater che e' un componente riutilizzabile per mostrare un dato e modificarlo
        - `types` contiene tutti i modelli dei dati, quindi classi o interfacce (utili per separare "come sono fatti" da "come sono usati")
          - `activity.model` classe delle activity
          - `event.model` classe degli eventi, in particolare
              gli eventi ripetuti hanno una distinzione tra "master" salvato nel db, e "instances" mostrate solo nella UI
          - `note.model` classe delle note
          - `notification.interface` permette all' `event.model` di salvare quando deve essere notificato
          - `pomodoro` usato nel `event.model` permette di salvare sul database il 'pomodoro'
          - `string-date` permette di gestire le date negli inputs come oggetto
              dividendo la parte giorno "yyyy-month-day" dalla parte tempo "hour:min"
        - `utils` contiene
          - `base.service` permette al client di avere operazioni CRUD generiche, utilizzato da `event.service`, `activity.service`, `note.service`
          - `contrast-colour.pipe` permette di scegliere un colore del testo (bianco o nero?) per gli eventi in "alto-contrasto" con il colore del evento
          - `crud-helper.ts` permette di gestire ARRAY di oggetti (eventi, activities), non viene utilizzato per le note
          - `date` permette di leggere le date presenti nel database in LocalTime (cosi` come deve vederle l'utente) e non shiftate usando UTC
          - `rrule-utils` permette di leggere e scrivere delle 'RRule', e di generare a partire del evento "master" le sue istanze ripetute
                'rrule.js' e` la libreria usata nella gestione delle ripetizioni degli eventi anche complessi
                    (esempio: "RaspiBO e` il secondo e quarto martedi` del mese")



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

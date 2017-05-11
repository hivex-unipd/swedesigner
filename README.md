# SWEDesigner [![Build Status](https://travis-ci.org/hivex-unipd/swedesigner.svg?branch=master)](https://travis-ci.org/hivex-unipd/swedesigner)
## Generate code directly from UML.

_SWEDesigner_ is an open-source project developed by the [Hivex team](https://hivex-unipd.github.io). It allows you to generate a Java program by drawing diagrams: we use a UML class diagram for generating your program's architecture and a special block diagram for generating the behavior of each class method of your program.

_SWEDesigner_ is a web app with a Java back end (it's hosted on a Tomcat server) and a JavaScript front end.


Questa guida vi guiderà nella installazione e/o compilazione del prodotto _SWEDesigner_. L'installazione e compilazione del prodotto sono state testate sotto i seguenti sistemi operativi:

1. Microsoft Windows 10
2. Canonical Ubuntu 16.04
3. Apple OS X El Capitan

## Installazione
### Prerequisiti installazione
È necessario avere le seguenti dipendenze installate sul proprio sistema:
1. Tomcat >=8.0
2. Java JDK >=1.7 (compilazione eseguibile)

### Deploy
Usare il file WAR desiderato presente nella cartella `/release` ed effettuare il deploy del package. Ulteriori dettagli sull'utilizzo di Tomcat sono disponibili ai seguenti indirizzi web:
1. https://tomcat.apache.org/tomcat-8.0-doc/deployer-howto.html (data di consultazione 07/05/2017, lingua inglese)
2. https://tomcat.apache.org/tomcat-8.0-doc/manager-howto.html (data di consultazione 07/05/2017, lingua inglese)

Qualora non sia stata correttamente impostata dal processo di installazione del Java JDK, impostare la variabile d'ambiente JAVA_HOME come indicato di seguito: https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/ (data di consultazione 07/05/2017, lingua inglese). 


### Creare una cartella personalizzata per gli upload dei utenti
Di default gli upload dei file degli utenti e i rispettivi file compilati sono creati nella cartella `/home/tomcat/Uploads/`. Qualora si desideri modificare il percorso della cartella degli upload, seguire l'intero procedimento; altrimenti è necessario seguire le indicazioni fino al punto 2.

1. Creare una cartella nella posizione desiderata (`/home/tomcat/Uploads/`)
2. Controllare i permessi della cartella (in lettura e scrittura)
3. Entra nella cartella di installazione di Tomcat, poi proseguire in `webapps/ROOT/WEB-INF/application.properties`
4. Modificare il file alla riga `uploadsDir = <PATH>`
5. Riavviare il server

Al termine della attività di deploy, recarsi all'indirizzo del server (di default `/localhost:8080`).

## Troubleshooting
### Viene presentato un errore 404 o un alert vuoto durante la pressione del pulsante "generate"
È necessario che il nome del file WAR sia esattamente ROOT.war in quanto l'applicazione funziona solo come applicazione principale.

## Compilazione
### Prerequisiti
1. Maven >=3.5.0

### Maven
1. Portarsi sulla path radice del progetto
2. Eseguire il seguente comando 
```mvn compile war:war```
3. Il file WAR sarà generato nella cartella `/target` con il nome `ROOT.war`




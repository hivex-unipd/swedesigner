# SWEDesigner [![Build Status](https://travis-ci.org/hivex-unipd/swedesigner.svg?branch=master)](https://travis-ci.org/hivex-unipd/swedesigner)
## Generate code directly from UML.

_SWEDesigner_ is an open-source project developed by the [Hivex team](https://hivex-unipd.github.io). It allows you to generate a Java program by drawing diagrams: we use a UML class diagram for generating your program's architecture and a special block diagram for generating the behavior of each class method of your program.

_SWEDesigner_ is a web app with a Java back end (it's hosted on a Tomcat server) and a JavaScript front end.

Structure of this repository:

    .
    ├── LICENSE
    ├── README.md
    ├── pom.xml
    ├── src
    │   ├── main
    │   │   ├── java
    │   │   │   └── org
    │   │   │       └── hivex
    │   │   │           └── swedesigner
    │   │   │               └── [.java source files...]
    │   │   ├── resources
    │   │   │   └── templates
    │   │   │       └── [StringTemplate templates...]
    │   │   └── webapp
    │   │       ├── WEB-INF
    │   │       │   ├── web.xml
    │   │       │   └── [Java applets...]
    │   │       ├── assets
    │   │       │   ├── joint.css
    │   │       │   └── style.css
    │   │       ├── images
    │   │       │   ├── [client images...]
    │   │       ├── index.html
    │   │       └── js
    │   │           └── [.js source files...]
    │   └── test
    │       └── java
    │           └── [.java test files...]
    └── target
        └── classes
            └── [.class files...]

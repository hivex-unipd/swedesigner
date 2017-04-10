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
    │   │   │   └── server
    │   │   │       ├── Application.java
    │   │   │       ├── compiler
    │   │   │       │   ├── Compiler.java
    │   │   │       │   └── java
    │   │   │       │       └── JavaCompiler.java
    │   │   │       ├── controller
    │   │   │       │   └── RequestHandlerController.java
    │   │   │       ├── generator
    │   │   │       │   ├── Generator.java
    │   │   │       │   ├── GeneratorAssembler.java
    │   │   │       │   └── java
    │   │   │       │       └── JavaGenerator.java
    │   │   │       ├── parser
    │   │   │       │   └── Parser.java
    │   │   │       ├── project
    │   │   │       │   ├── ParsedAttribute.java
    │   │   │       │   ├── ParsedClass.java
    │   │   │       │   ├── ParsedCustom.java
    │   │   │       │   ├── ParsedElement.java
    │   │   │       │   ├── ParsedElse.java
    │   │   │       │   ├── ParsedException.java
    │   │   │       │   ├── ParsedFor.java
    │   │   │       │   ├── ParsedIf.java
    │   │   │       │   ├── ParsedInstruction.java
    │   │   │       │   ├── ParsedInterface.java
    │   │   │       │   ├── ParsedMethod.java
    │   │   │       │   ├── ParsedProgram.java
    │   │   │       │   ├── ParsedReturn.java
    │   │   │       │   ├── ParsedStatement.java
    │   │   │       │   ├── ParsedType.java
    │   │   │       │   └── ParsedWhile.java
    │   │   │       ├── stereotype
    │   │   │       │   └── Stereotype.java
    │   │   │       ├── template
    │   │   │       │   ├── Template.java
    │   │   │       │   ├── TemplateAssembler.java
    │   │   │       │   └── java
    │   │   │       │       └── JavaTemplate.java
    │   │   │       └── utility
    │   │   │           └── Compressor.java
    │   │   ├── resources
    │   │   │   ├── ContentFile
    │   │   │   │   └── [generated code]
    │   │   │   └── templates
    │   │   │       ├── attributejavatemplate.st
    │   │   │       ├── classjavatemplate.st
    │   │   │       ├── elsejavatemplate.st
    │   │   │       ├── forjavatemplate.st
    │   │   │       ├── ifjavatemplate.st
    │   │   │       ├── initVis.st
    │   │   │       ├── interfacejavatemplate.st
    │   │   │       ├── methodjavatemplate.st
    │   │   │       ├── returnjavatemplate.st
    │   │   │       ├── statementjavatemplate.st
    │   │   │       └── whilejavatemplate.st
    │   │   └── webapp
    │   │       ├── WEB-INF
    │   │       │   └── web.xml
    │   │       ├── assets
    │   │       │   ├── joint.css
    │   │       │   ├── jquery-ui.css
    │   │       │   └── style.css
    │   │       ├── doc
    │   │       │   ├── [HTML docs for the front end]
    │   │       ├── images
    │   │       │   ├── android-desktop.png
    │   │       │   ├── dog.png
    │   │       │   ├── favicon.png
    │   │       │   ├── ios-desktop.png
    │   │       │   └── user.jpg
    │   │       ├── index.html
    │   │       ├── js
    │   │       │   ├── collection
    │   │       │   │   └── DiagramsCollection.js
    │   │       │   ├── libs
    │   │       │   │   ├── backbone
    │   │       │   │   │   └── backbone.js
    │   │       │   │   ├── jointjs
    │   │       │   │   │   └── joint.js
    │   │       │   │   ├── jquery
    │   │       │   │   │   └── jquery.js
    │   │       │   │   ├── jqueryui
    │   │       │   │   │   └── jquery-ui.js
    │   │       │   │   ├── lodash
    │   │       │   │   │   └── lodash.js
    │   │       │   │   ├── mdl
    │   │       │   │   │   └── material.js
    │   │       │   │   └── require
    │   │       │   │       ├── require.js
    │   │       │   │       └── text.js
    │   │       │   ├── main.js
    │   │       │   ├── models
    │   │       │   │   ├── Command.js
    │   │       │   │   ├── ProjectModel.js
    │   │       │   │   ├── celltypes
    │   │       │   │   │   └── celltypes.js
    │   │       │   │   ├── newcellfactory.js
    │   │       │   │   └── newcellmodel.js
    │   │       │   ├── test.js
    │   │       │   └── views
    │   │       │       ├── AppView.js
    │   │       │       ├── ProjectView.js
    │   │       │       ├── detailsview.js
    │   │       │       └── newcellview.js
    │   │       └── test.html
    │   └── test
    │       └── java
    │           ├── compiler
    │           │   └── CompilerTest.java
    │           ├── controller
    │           │   └── RequestHandlerControllerTest.java
    │           ├── generator
    │           │   └── GeneratorTest.java
    │           ├── parser
    │           │   └── ParserTest.java
    │           ├── project
    │           │   ├── ParsedAttributeTest.java
    │           │   ├── ParsedClassTest.java
    │           │   ├── ParsedCustomTest.java
    │           │   ├── ParsedElseTest.java
    │           │   ├── ParsedForTest.java
    │           │   ├── ParsedIfTest.java
    │           │   ├── ParsedInterfaceTest.java
    │           │   ├── ParsedMethodTest.java
    │           │   ├── ParsedProgramTest.java
    │           │   ├── ParsedReturnTest.java
    │           │   └── ParsedWhileTest.java
    │           ├── template
    │           │   └── JavaTemplateTest.java
    │           └── utility
    │               └── CompressorTest.java
    └── target
        └── [.class files...]

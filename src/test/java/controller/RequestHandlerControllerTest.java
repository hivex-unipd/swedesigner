package controller;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;

import server.Configurator;
import test.TestConfigurator;
import server.controller.RequestHandlerController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;

// vedi anche https://spring.io/guides/gs/spring-boot/
// ---------------------------------------------------

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Configurator.class, TestConfigurator.class})
public class RequestHandlerControllerTest {

	@Autowired
	@Qualifier("stubbedrhc")
	private RequestHandlerController stubbedrhc;

	@Autowired
	@Qualifier("rhc")
	private RequestHandlerController rhc;



	// Test di integrazione:
	// =====================

	// Avviato un RequestHandlerController, questo è in grado di rispondere a una richiesta di generazione di codice interagendo con un Parser, un Generator, un Compiler e un Compressor e fornendo un archivio ZIP.
	@Test
	public void controllerHandlesRequest() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = rhc.handleGeneratorRequest(request);
		File zip = new File("src/main/resources/sort/projectzip.zip");
		assertTrue(zip.exists());
	}



	// Test di unità:
	// ==============

	// Avviato un RequestHandlerController, questo è in grado di rispondere a una richiesta di generazione di codice.
	@Test
	public void controllerInteractsWithCompiler() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = stubbedrhc.handleGeneratorRequest(request);
	}
}

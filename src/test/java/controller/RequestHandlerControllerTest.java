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



	// Test di unità:
	// ==============

	// Avviato un RequestHandlerController, questo è in grado di rispondere a una richiesta di generazione di codice.
	@Test
	public void controllerHandlesRequest() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = stubbedrhc.handleGenerationRequest(request);
	}



	// Test di integrazione:
	// =====================

	// Il sistema gestisce correttamente l'interazione tra un RequestHandlerController e i suoi membri di tipo Parser, Generator, Compiler e Compressor (del swedesigner::server).
	@Test
	public void controllerInteractsWithComponents() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = rhc.handleGenerationRequest(request);
		// TODO? non abbiamo la cartella Uploads...
//		File zip = new File("src/main/resources/sort/projectzip.zip");
//		assertTrue(zip.exists());
	}

	// Il sistema gestisce correttamente l'interazione tra un RequestHandlerController e un Compiler di swedesigner::server.
	@Test
	public void controllerInteractsWithCompiler() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = rhc.handleGenerationRequest(request);
		// TODO?
	}

	// Il sistema gestisce correttamente le componenti relative al package utility; in particolare, gestisce correttamente l'interazione tra un RequestHandlerController e un Compressor di swedesigner::server.
	@Test
	public void controllerInteractsWithCompressor() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = rhc.handleGenerationRequest(request);
		// TODO?
	}
}

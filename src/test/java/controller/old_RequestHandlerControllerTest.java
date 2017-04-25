package controller;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;

import server.Configurator;
import server.controller.RequestHandlerController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Configurator.class)
public class old_RequestHandlerControllerTest {

	@Autowired
	@Qualifier("rhc")
	private RequestHandlerController rhc;

	// Avviato un RequestHandlerController, questo è in grado di rispodere a una richiesta di generazione di codice fornendo un archivio ZIP.
	@Test
	public void controllerHandlesRequest() throws IOException {
		HttpEntity<String> request = new HttpEntity<String>(new String(Files.readAllBytes(Paths.get("src/main/resources/project.json"))));
		ResponseEntity<?> result = rhc.handleGeneratorRequest(request);
		// TODO ...
	}

	// vedi anche https://spring.io/guides/gs/spring-boot/
	// ---------------------------------------------------
}

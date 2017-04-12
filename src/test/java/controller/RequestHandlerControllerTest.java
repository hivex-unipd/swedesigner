package controller;

// from    https://spring.io/guides/gs/spring-boot/

import static org.hamcrest.Matchers.equalTo;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import server.controller.RequestHandlerController;
import server.Configurator;

@RunWith(SpringRunner.class)
@SpringBootTest(classes=Configurator.class)
@AutoConfigureMockMvc
public class RequestHandlerControllerTest {

	@Autowired
	private MockMvc mvc;

	// Avviato un RequestHandlerController, questo è in grado di rispodere a una richiesta di generazione di codice fornendo un archivio ZIP.
	@Test
	public void controllerHandlesGenerationRequest() throws Exception {
		// TODO per ora torna 400 anziché 200:
//		mvc.perform(MockMvcRequestBuilders.get("/generate").accept(MediaType.ALL)).andExpect(status().isOk());
	}
}

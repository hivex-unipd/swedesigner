package generator;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.controller.RequestHandlerController;
import server.compiler.java.JavaCompiler;

import org.json.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;

public class old_RequestHandlerControllerTest {

	// ...
	@Test
	public void controllerHandlesRequest() throws IOException {
		String request = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));
//		RequestHandlerController rhc = new RequestHandlerController();
//		Resource result = rhc.HandleGeneratorRequest(request);
	}
}

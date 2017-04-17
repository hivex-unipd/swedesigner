package server;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import server.controller.RequestHandlerController;

public class ProvaMain {
	public static void main(String[] args){
		
		try{
			String testo = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));
			//RequestHandlerController rhc = new RequestHandlerController();
			ApplicationContext context = new AnnotationConfigApplicationContext(Configurator.class);
			RequestHandlerController rhc = (RequestHandlerController)context.getBean("rhc");
			rhc.HandleGeneratorRequest(testo, "1234");	
		}
		catch(IOException exception){System.out.println(exception.getMessage());}	
	}
}

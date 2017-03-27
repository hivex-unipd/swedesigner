package server.template;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import server.template.java.JavaTemplate;

@Configuration
public class TemplateAssembler {
	@Bean("javatemplate")
	public Template javatemplate(){
		return new JavaTemplate();
	}
}

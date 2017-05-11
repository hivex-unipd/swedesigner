package server.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.annotation.PostConstruct;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server.generator.Generator;
import server.parser.Parser;
import server.project.ParsedProgram;
import server.compiler.Compiler;
import server.utility.Compressor;

/**
 * A {@code RequestHandlerController} object is the main
 * entry point for handling HTTP requests from a client.
 */
@RestController
public class RequestHandlerController {

	private Parser parser = new Parser();
	
	@Autowired
	private Environment env;

	@Autowired
	@Qualifier("javagenerator")
	private Generator generator;

	@Autowired
	@Qualifier("javacompiler")
	private Compiler compiler;

	private Compressor compressor = new Compressor();
	
	private String uploadFolder;
	
	@PostConstruct
	private void init() {
		uploadFolder = env.getProperty("UploadsDir");
	}
	
	/**
	 * Responds to an HTTP request for the "generate" resource.
	 * The request must carry a JSON file; the response produces
	 * a ZIP archive.
	 * @param  httpEntity the HTTP request
	 * @return            the HTTP response
	 */
	@RequestMapping(value = "/generate", consumes = "application/json", produces = "application/zip")
	public ResponseEntity<?> handleGenerationRequest(HttpEntity<String> httpEntity) {
		String idReq = UUID.randomUUID().toString();
		String json = httpEntity.getBody();
		// List for recording the errors:
		List<String> errors = new ArrayList<String>();
		String folderPath = uploadFolder + idReq;
		createDirectory(folderPath);

		ParsedProgram parsedProgram = null;

		try {
			parsedProgram = parser.createParsedProgram(json);
		} catch (JSONException exception) {
			errors.add(exception.getMessage());
		}
		List<String> parserErrors = parser.getErrors();
		if (!parserErrors.isEmpty()) {
			errors.addAll(parserErrors);
		} else {
			try {
				generator.generate(folderPath, parsedProgram);
				errors.addAll(compiler.compile(folderPath));
			} catch (IOException exception) {
				errors.add(exception.getMessage());
			}
			try {
				compressor.zip(folderPath);
			} catch (IOException exception) {
				errors.add(exception.getMessage());
			}
		}
		byte[] ba = null;

		try {
			ba = Files.readAllBytes(Paths.get(folderPath + "/projectzip.zip"));
		} catch (IOException e) {
			errors.add(e.getMessage());
		}
		
		// It should return a Request object containing the zip just created.
		// This will be implemented later.
		if (errors.size() > 0) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors.toString());
		} else {
			return ResponseEntity.ok(ba);
		}
	}

	private void createDirectory(String pathFolder) {
		File folder = new File(pathFolder);
		if (folder.exists()) {
			try {
				System.err.println("Cleaning the directory...");
				FileUtils.cleanDirectory(folder);
			} catch (IOException e) {
				// e.printStackTrace();
			}
		} else {
			boolean isDirectoryCreated = folder.mkdir();
			if (!isDirectoryCreated) {
				try {
					FileUtils.forceDelete(folder);
				} catch (IOException e) {
					e.printStackTrace();
				}
				folder.mkdir();
			}
		}
	}
}

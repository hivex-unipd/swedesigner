package test;

import java.io.IOException;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.controller.RequestHandlerController;
import server.generator.Generator;
import server.compiler.Compiler;
import server.parser.Parser;
import server.utility.Compressor;
import server.project.ParsedProgram;

public class StubbedRequestHandlerController extends RequestHandlerController {

	private Parser parser = new MockParser();

	@Autowired
	@Qualifier("mockjavagenerator")
	private Generator generator;

	@Autowired
	@Qualifier("mockjavacompiler")
	private Compiler compiler;

	private Compressor compressor = new MockCompressor();
}

class MockParser extends Parser {
	@Override
	public ParsedProgram createParsedProgram(String jsonString) throws JSONException {
		return new ParsedProgram();
	}
}

class MockCompressor extends Compressor {
	@Override
	public void zip(String dirPath) throws IOException {
		return;
	}
}

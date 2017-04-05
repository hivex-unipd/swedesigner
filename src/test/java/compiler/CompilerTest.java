package compiler;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.compiler.Compiler;
import server.compiler.java.JavaCompiler;
import server.template.java.JavaTemplate;

public class CompilerTest {
	@Test
	public void compilerCanCompile() {
		Compiler compiler = new JavaCompiler();
		// ...
	}
}

package compiler;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.compiler.Compiler;
import server.compiler.java.JavaCompiler;

import java.util.List;
import java.io.IOException;

public class CompilerTest {

	// JavaCompiler è in grado di compilare dei file sorgente Java (posti in una stessa directory) in un file eseguibile, senza generare errori di compilazione.
	@Test
	public void compilerCanCompile() throws IOException {
		Compiler compiler = new JavaCompiler();
		List<String> results = compiler.compile("src/main/resources/sort");
		assertEquals(0, results.size());
	}

	// un JavaCompiler a cui venga chiesto di compilare i file di una cartella inesistente ritorna una lista di errori contenente l'errore "[cartella] is not a valid directory".
	@Test
	public void compilerRejectsNonDirectories() throws IOException {
		Compiler compiler = new JavaCompiler();
		List<String> results = compiler.compile("src/main/resources/nothing");
		assertThat(results, hasItems("nothing is not a valid directory"));
	}
}

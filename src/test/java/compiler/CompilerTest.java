package compiler;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;

import server.Configurator;
import server.compiler.Compiler;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.List;
import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Configurator.class)
public class CompilerTest {

	@Autowired
	@Qualifier("javacompiler")
	private Compiler compiler;

	// JavaCompiler è in grado di compilare dei file sorgente Java (posti in una stessa directory) in un file eseguibile, senza generare errori di compilazione.
	@Test
	public void compilerCanCompile() throws IOException {
		List<String> results = compiler.compile("src/main/resources/sort");
		assertEquals(0, results.size());
	}

	// un JavaCompiler a cui venga chiesto di compilare i file di una cartella inesistente ritorna una lista di errori contenente l'errore "[cartella] is not a valid directory".
	@Test
	public void compilerRejectsNonDirectories() throws IOException {
		List<String> results = compiler.compile("src/main/resources/nothing");
		assertThat(results, hasItems("nothing is not a valid directory"));
	}
}

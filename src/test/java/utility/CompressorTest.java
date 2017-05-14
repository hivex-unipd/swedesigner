package utility;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.utility.Compressor;

import org.json.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;

public class CompressorTest {

	private Compressor comp = new Compressor();



	// Test di unità:
	// ==============

	// Un Compressor è in grado di comprimere in formato ZIP una directory nel filesystem del server.
	@Test
	public void compressorCanZip() throws IOException {
		comp.zip("src/main/resources/sort");
		File zip = new File("src/main/resources/sort/project.zip");
		assertTrue(zip.exists());
		Files.delete(Paths.get("src/main/resources/sort/project.zip"));
	}
}

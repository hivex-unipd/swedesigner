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

	// Un Compressor è in grado di comprimere in formato ZIP una directory nel filesystem del server.
	@Test
	public void compressorCanZip() throws IOException {
		Compressor comp = new Compressor();
		comp.zip("src/main/resources/sort");
		File zip = new File("src/main/resources/sort/projectzip.zip");
		assertTrue(zip.exists());
		Files.delete(Paths.get("src/main/resources/sort/projectzip.zip"));
	}
}

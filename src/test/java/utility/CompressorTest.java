package utility;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.utility.Compressor;

import org.json.*;
import java.io.IOException;
import org.springframework.core.io.Resource;

public class CompressorTest {

	// Un Compressor è in grado di eseguire ZIP su un file del filesystem.
	@Test
	public void compressorCanZip() throws IOException {
		Compressor comp = new Compressor();
		comp.zip("src/main/resources/sort");
	}
}

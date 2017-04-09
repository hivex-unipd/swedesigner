package generator;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.utility.Compressor;
import server.compiler.java.JavaCompiler;

import org.json.*;
import java.io.IOException;
import org.springframework.core.io.Resource;

public class CompressorTest {

	// Un Compressor è in grado di eseguire ZIP su un file nel filesystem
	@Test
	public void compressorCanZip() throws IOException {
		Compressor comp = new Compressor();
		comp.zip("1234");
	}
}

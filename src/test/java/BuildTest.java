package swedesigner.server;

import static org.junit.Assert.*;
import org.junit.Test;

public class BuildTest {
	@Test
	public void testIsCreated() {
		Integer test = new Integer(4250);
		assertEquals(test.toString(), "4250");
	}
}

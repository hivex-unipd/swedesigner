package server.utility;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * A {@code Compressor} object can compress files
 * in a given path into a ZIP archive.
 */
public class Compressor {
	public void zip(String dirPath) throws IOException {
		byte[] buffer = new byte[1024];
		File zip = new File(dirPath + "/projectzip.zip");

		FileOutputStream fos = new FileOutputStream(zip);
		ZipOutputStream zos = new ZipOutputStream(fos);

		File folder = new File(dirPath); 
		File[] files = folder.listFiles();
		for (File file : files) {
			if (file.isFile()) {
				if (!(file.getName().equals("projectzip.zip"))) {
					ZipEntry ze= new ZipEntry(file.getName());
					zos.putNextEntry(ze);
					FileInputStream in = new FileInputStream(file);
					int len;
					while ((len = in.read(buffer)) > 0) {
						zos.write(buffer, 0, len);
					}
					in.close();
					zos.closeEntry();
				}
			}
		}

		zos.close();
	}
}

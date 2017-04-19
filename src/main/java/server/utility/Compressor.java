package server.utility;

import java.io.*; 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.ObjectOutputStream;
import java.io.ObjectInputStream;


public class Compressor {
	public void zip(String pathFolder) throws IOException{
/*parte zip*/
	byte[] buffer = new byte[1024];
	File zip = new File(pathFolder+"/projectzip.zip");
	FileOutputStream fos = new FileOutputStream(zip);
	ZipOutputStream zos = new ZipOutputStream(fos);
	File folder = new File(pathFolder); 
	File[] files = folder.listFiles();		
	for(File file : files){
		if(file.isFile()){
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
	zos.close();//importante chiudere!!!
	}
}

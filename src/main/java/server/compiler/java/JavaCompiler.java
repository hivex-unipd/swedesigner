package server.compiler.java;

import server.compiler.Compiler;

import java.io.IOException;
import javax.tools.ToolProvider;
import javax.tools.JavaFileObject;
import javax.tools.DiagnosticCollector;
import javax.tools.Diagnostic;
import javax.tools.StandardJavaFileManager;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JavaCompiler implements Compiler {
	
	public List<String> compile(String fileName) throws IOException {
	    List<String> errors = new ArrayList<String>(); 
	    System.setProperty("java.home", "C:\\Program Files (x86)\\Java\\jdk1.7.0_79");
	    javax.tools.JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
	    DiagnosticCollector<JavaFileObject> diagnosticsCollector = new DiagnosticCollector<JavaFileObject>();
	    StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnosticsCollector, null, null);
	    Iterable<? extends JavaFileObject> compilationUnits = fileManager.getJavaFileObjectsFromStrings(Arrays.asList(fileName));
	    javax.tools.JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnosticsCollector, null, null, compilationUnits);
	    boolean success = task.call();
	    if (!success) {
	        List<Diagnostic<? extends JavaFileObject>> diagnostics = diagnosticsCollector.getDiagnostics();
	        for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics) {
	            // read error details from the diagnostic object
	            errors.add(diagnostic.getMessage(null));
	        }
	    }
	    fileManager.close();
	    return errors;
	    }
	
}

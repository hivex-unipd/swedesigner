package util;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.*;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;
import java.util.Random;

public class Monkey {

	private static String[] vocabulary = {
		"pippo",
		"pluto",
		"paperino",
		"x",
		"y",
		"tmp",
		"i",
		"index",
		"j",
		"k",
		"newVar",
		"test"
	};

	private static int[] ints = {-3, -2, -3, 0, 1, 2, 3, 4, 5, 6, 10, 100, 1000, 10000};

	private static float[] floats = {-5.2f, -1.7E2f, -0.4f, 0f, 0.0f, 0.23f, 1.4f, 2.718f, 10.4f, 100f, 42.0f, 10000.2f};

	private static String[] comps = {"==", "<", ">", "<=", ">=", "!="};

	public static String varName() {
		int randIndex = new Random().nextInt(vocabulary.length);
		return vocabulary[randIndex];
	}

	public static int integer() {
		int randIndex = new Random().nextInt(ints.length);
		return ints[randIndex];
	}

	public static float decimal() {
		int randIndex = new Random().nextInt(floats.length);
		return floats[randIndex];
	}

	public static String comp() {
		int randIndex = new Random().nextInt(comps.length);
		return comps[randIndex];
	}

	public static ParsedAssignment assignment() {
		return new ParsedAssignment(varName(), Float.toString(decimal()));
	}

	public static ParsedInstruction test() {
		return new ParsedIf(varName() + " " + comp() + " " + Float.toString(decimal()), rand(new Random().nextInt(10)));
	}

/*	public static ParsedInstruction cycle() {
		int which = new Random().nextInt(4);
		if (which == 0) {
			return new ParsedFor(varName() + " " + comp() + " " + Float.toString(decimal()), rand(new Random().nextInt(10)));
		} else if (which == 1) {
			return new ParsedWhile(varName() + " " + comp() + " " + Float.toString(decimal()), rand(new Random().nextInt(10)));
		}
	}*/

	public static ParsedReturn end() {
		return new ParsedReturn(varName());
	}

	public static ParsedInstruction rand() {
		return new ParsedInitialization("String", varName(), "\"" + varName() + "\"");
	}

	public static List<ParsedInstruction> rand(final int size) {
		List<ParsedInstruction> instructions = Arrays.asList();
		for (int i = 0; i < size; i++)
			instructions.add(rand());
		return instructions;
	}
}

package sort;

public class Sort {
	public static void main(String[] args) {
		Element[] input = new Element[10];
		for (int i = 0; i < input.length; i++) {
			input[i] = new NormalElement();
			input[i].setValue(10 - i);
		}
		for (int i = 0; i < input.length; i++)
			System.out.print(input[i].getValue() + " ");
		System.out.println();

		SortAlgorithm algo = new InsertionSortAlgorithm();

		Element[] output = algo.execute(input);
		for (int i = 0; i < output.length; i++)
			System.out.print(output[i].getValue() + " ");
		System.out.println();
	}
}

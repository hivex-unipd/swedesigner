package sort;

public class InsertionSortAlgorithm implements SortAlgorithm {
	private Element[] swap(Element[] array, int i, int j) {
		int tmp = array[i].getValue();
		array[i].setValue(array[j].getValue());
		array[j].setValue(tmp);
		return array;
	}

	public Element[] execute(Element[] array) {
		for (int i = 1; i < array.length; i++) {
			int j = i;
			while (j > 0 && array[j-1].greaterThan(array[j])) {
				array = swap(array, j, j-1);
				j = j - 1;
			}
		}
		return array;
	}
}

package sort;

public class NormalElement implements Element {
	private int value = 0;
	public int getValue() { return value; }
	public void setValue(int v) { value = v; }
	public boolean greaterThan(Element e) {
		return getValue() > e.getValue();
	}
}

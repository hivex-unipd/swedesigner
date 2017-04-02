package server.check;

import java.util.ArrayList;
import java.util.List;

import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedInstruction;
import server.project.ParsedInterface;
import server.project.ParsedMethod;
/* è stato aggiunto un campo dati Check checker all'interno della classe JavaGenerator (istanziato sempre utilizzando
 * un @Bean di Spring). Sarà tale classe che, prima di generare il codice, provvederà sui tipi ciclati ad invocare la corrispondente
 * funzione void check(Check checker) e verificare così se sono conformi o no alle principali regole del linguaggio target (vedi JavaGenerator.java).
 * */
public class JavaCheck implements Check {
	/*PRE: devo comunque considerare che il Parser costruisce dei ParsedElement con all'interno già
	 * i campi obbligatori per i diagrammi scelti (es. per un attributo ci saranno SEMPRE il nome e il tipo)
	 * (forse che comunque è necessario un ulteriore controllo?)
	 */

	@Override
	public void checkClass(ParsedClass pc) throws LanguageException{
		
	}

	@Override
	public void checkInterface(ParsedInterface pi) throws LanguageException{
		
	}

	@Override
	public void checkAttribute(ParsedAttribute pa) throws LanguageException{
		
	}

	@Override
	//si tratta solo di un esempio di funzionamento di questo metodo, poco è effettivamente implementato
	public void checkMethod(ParsedMethod pm) throws LanguageException{
		//il parser mi assicura che ogni metodo ha sempre almeno il NOME e il TIPO DI RITORNO;
		//per prima cosa controllo la lista degli argomenti
		
		//preparo una lista dove memorizzare tutti gli errori che saranno poi inseriti eventualmente nell'eccezione che sarà lanciata
		List<String> errors = new ArrayList<String>();
		
		//per prima cosa controllo che gli argomenti siano tutti legali
		List<ParsedAttribute> args = pm.getArgs();
		for(int i=0; i<args.size(); i++){
			/*try{ //args.get(i).check(this); si tratta di un metodo non ancora implementato (vedi commento ParsedElement);
			}catch(LanguageException e){
				//faccio il merge delle due liste
				errors.addAll(e.getErrors());
			}*/
		}
		
		List<ParsedInstruction> body = pm.getBody();
		
		//controllo l'effettiva astrattezza
		if(pm.getIs_abstract())
			if(pm.getBody()!=null)
				errors.add("Java language error: method "+pm.getName()+" is declared abstract but has implemented body");
		else//controllo che tutte le istruzioni del metodo siano legali nel linguaggio Java
			for(int i=0; i<body.size(); i++){
				/*try{
					//body.get(i).check(this); si tratta di un metodo non ancora implementato (vedi commento ParsedElement);
				}catch(LanguageException e){
					//faccio il merge delle due liste
					errors.addAll(e.getErrors());
				}*/
			}
		if(errors.size()!=0)
			throw new LanguageException(errors);
	}
  }

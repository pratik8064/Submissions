%Problem 2
%Tower of Hanoi
%input is num, source, destination and intermediate peg.

%base case.
hanoi(1,Source,Destination,_):- 
	write('Move '),
	write(Source),
	write(' to '),
	write(Destination),
	nl.
hanoi(Num,Source,Destination,Inter):-
	Num > 1,				
	NewNum is Num-1,										
	hanoi(NewNum,Source,Inter,Destination),							
	hanoi(1,Source,Destination,Inter),
	hanoi(NewNum,Inter,Destination,Source).
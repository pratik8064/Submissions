
%n queens problem to show place of queens without any conflict

queens(Num,Queens):-
	generateList(1,Num,Ns),
	queens(Ns,[],Queens).

queens(QueenList,SafeQueens,Queens):-
	select(Queen,QueenList,QueenList1),
	not(attack(Queen,SafeQueens)),
	queens(QueenList1,[Queen|SafeQueens],Queens).

queens([],Queens,Queens).

attack(A,As):-
	attack(A,1,As).

%predicate to calculate safe rows and columns
attack(A,N,[B|Ys]):-
	A is B + N;
	A is B - N.

attack(A,N,[B|Ys]):-
	Next is N + 1,
	attack(A,Next,Ys).

%helper function to generate list.

generateList(P,P,[P]).

generateList(A,B,[A|L]) :-
	A < B,
	Next is A + 1,
	generateList(Next,B,L).

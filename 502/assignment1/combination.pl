%Problem4
%Generate the combinations of K distinct objects chosen from the N elements of a list.

combination(Num, Input, Output) :-
	length(Input, InLength),
	length(Output, Num),
	Num =< InLength,
	helperFunction(Output, Input).

%base case to stop the recursive call.
helperFunction([], _).

helperFunction([Head|Tail], Input) :-
	select(Head, Input, Output),
	helperFunction(Tail, Output).

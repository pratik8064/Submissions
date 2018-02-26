%Problem 3 full words %
% db to store map of words

word(0,zero).
word(1,one).
word(2,two).
word(3,three).
word(4,four).
word(5,five).
word(6,six).
word(7,seven).
word(8,eight).
word(9,nine).

full_words(Num) :-       
	Quotient is div(Num,10),  
	helperFunction(Quotient),
	Remainder is mod(Num,10), 
	word(Remainder,Word),
	write(Word).
					
%this is base caee.
helperFunction(0).      

%this function will get the remainder and print it with dash and recursively divide number by 10 to get next number
helperFunction(Num) :-  
	Num > 0,           
	Quotient is div(Num,10),  
	helperFunction(Quotient),
	Remainder is Num mod 10,
	word(Remainder,Word),
	dash(Word).	
					
%function to print - 
dash(Word) :- 
			write(Word),write('-').

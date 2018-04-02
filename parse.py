class ParseObject():

	# ABSTRACT SYNTAX
		# 'blist' : \begin{itemize}
		# 'nlist' : \begin{enumerate}
		# 'item' : \item
		# 'endblist' : \end{enumerate}
		# 'endnlist' : \endnlist{enumerate}
		# '$' : $
		# '$$' : $$
		# 'bheader '
		# 'begintitle' : \title{
		# 'beginauthor' : \author{
		# 'begindate' : \date{
		# 'endbauthor : }'
		# 'enddate' : }'
		# 'endtitle' : }'

	def __init__(self, preference_map, title, author):
		self.title = title
		self.author = author
		self.preference_map = preference_map
		# self.state = self.init_state_map()

	# def validate_preferences(self, preference_map):
	# 	if (set(preference_map.values()) <= self.valid_preferences):
	# 		return preference_map
	# 	else:
	# 		raise ValueError('ERROR: Please input a valid preference map.')

	# def init_state_map(self):
	# 	keywords = self.preference_map.values()
	# 	state = {keyword: False for keyword in keywords}
	# 	return state

	# Apply preferences to segment of a text_arr
	def apply_preferences(self, text_arr, preference_map):
		stream = text_arr
		latex_arr = []
		while stream:
			token = stream.pop(0)
			if token in preference_map:
				latex_tok = self.handle_token(preference_map[token])
				latex_arr.append(latex_tok)
			else:
				latex_arr.append(token)

		return (latex_arr, text_arr)

	def handle_token(self, tok):
		latex_tok = ""

		if (tok == "blist"):
			latex_tok = "\\begin{itemize}"

		elif (tok == "nlist"):
			latex_tok = "\\begin{enumerate}"

		elif (tok == "item"):
			latex_tok = "\item"

		elif (tok == "endblist"):
			latex_tok = "\end{itemize}"

		elif (tok == "endnlist"):
			latex_tok = "\end{enumerate}"

		elif (tok == "$$"):
			latex_tok = "$$"

		elif (tok == "$"):
			latex_tok = "$"

		return latex_tok

	def write_latex_file(self, body_arr, filename):
		tex_file = open(filename + ".tex", "w+")
		article_class = " \documentclass{article} "
		header = "\\title{" + self.title + "}" + " \\author{" + self.author + "}"
		document_opener = "\\begin{document} \\maketitle "
		opener = article_class + header + document_opener
		body = " ".join(body_arr)
		ender = " \end{document} "
		tex_file.write(opener + body + ender)

	def gen_latex(self, text_arr, filename):
		latex_arrs = self.apply_preferences(text_arr, self.preference_map)
		self.write_latex_file(latex_arrs[0], filename)

# preference_map = {'nl': 'nlist', 'enl': 'endnlist', 'li': 'item', 'bl': 'blist', 'ebl': 'endblist', 'exp': '$', 'cexp': '$$'}

# test_list = "The following input will display as a latex-numbered list using our preference map: # ^ first element ^ second element ^ third element #! "

# test_math = "The following input will display as a latex-math equation: !! f(x) = c_1*x^2 + c_2*x^3 + c_3*x^5 !! "




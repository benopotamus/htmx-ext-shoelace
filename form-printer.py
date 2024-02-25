# Run with
# flask --app form-printer --debug run

from flask import Flask, request, render_template
from pprint import pformat

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='/')

@app.route("/native")
def native_form():
	return render_template("native-test.html")

@app.route("/shoelace")
def shoelace_form():
	return render_template("shoelace-test.html")

@app.route("/submit", methods=['GET', 'POST'])
def response():
	return pformat(request.form.to_dict(flat=False))
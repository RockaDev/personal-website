from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_wtf import FlaskForm
from sqlalchemy.sql.expression import true
from sqlalchemy.sql.functions import user
from website import views
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from . import db

auth = Blueprint('auth',__name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password1')

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user,remember=True)
                return redirect(url_for('views.home'))
            else:
                flash('Incorrect password, try again.', category='error')
        else:
            flash('Email does not exist.', category='error')

    return render_template("login.html", user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth.login"))

@auth.route('/signup', methods=["GET","POST"])
def signup():
    if request.method == "POST":
        email = request.form.get('email')
        first_name = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        username = request.form.get('username')

        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email already exists.', category='error')
        elif len(email) < 4:
            flash('Email too short!', category='error')
        elif len(first_name) < 2:
            flash('Firstname too short!', category='error')
        elif len(username) < 3:
            flash('Username too short!', category='error')
        elif password1 != password2:
            flash("Passwords don't match!", category='error')
        elif len(password1) < 7:
            flash('Password is too weak!', category='error')
        else:
            new_user = User(email=email,first_name=first_name,username=username,password=generate_password_hash(password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user,remember=True)
            flash("Account created.", category='success')
            return redirect(url_for('views.home'))

    return render_template("signup.html", user=current_user)



@auth.route("/about")
@login_required
def about_me():
    return render_template("about.html", user=current_user)


@auth.route("/project")
@login_required
def portfolio():
    return render_template("project.html", user=current_user)




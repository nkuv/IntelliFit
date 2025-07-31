from mongoengine import Document, StringField, EmailField, DateTimeField, IntField, ListField, ReferenceField
from datetime import datetime, timezone
datetime.now(timezone.utc)

class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    fitness_goal = StringField()
    workout_frequency = StringField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

class WorkoutPlan(Document):
    user = ReferenceField(User, required=True)
    plan_name = StringField(default="AI Suggested Plan")
    days = ListField(StringField())
    structure = ListField(ListField(StringField()))
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    source = StringField(choices=["AI", "User"], default="AI")

class WorkoutLog(Document):
    user = ReferenceField(User, required=True)
    date = DateTimeField(required=True)
    workout_type = StringField()
    exercise_name = StringField(required=True)
    sets = IntField()
    reps = IntField()
    weight = IntField()
    duration_minutes = IntField()
    plan_reference = ReferenceField(WorkoutPlan, null=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

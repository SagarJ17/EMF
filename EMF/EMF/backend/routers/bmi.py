from fastapi import APIRouter, Request
from schemas.schemas import BMIRequest, BMIResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "lightly_active": 1.375,
    "moderately_active": 1.55,
    "very_active": 1.725,
    "extra_active": 1.9,
}


def calculate_bmr(weight_kg: float, height_cm: float, gender: str) -> float:
    if gender == "male":
        return 10 * weight_kg + 6.25 * height_cm - 5 * 25 + 5
    else:
        return 10 * weight_kg + 6.25 * height_cm - 5 * 25 - 161


def get_bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal weight"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


def get_recommendations(bmi: float, category: str) -> list[str]:
    if category == "Underweight":
        return [
            "Increase calorie intake by 300–500 kcal/day",
            "Focus on protein-rich foods (eggs, chicken, legumes)",
            "Add strength training 3x per week",
            "Eat every 3–4 hours to boost caloric intake",
            "Include healthy fats: nuts, avocado, olive oil",
        ]
    elif category == "Normal weight":
        return [
            "Maintain current calorie balance",
            "Stay consistent with training 4x per week",
            "Prioritize sleep 7–9 hours for recovery",
            "Walk 8000+ steps daily",
            "Include mobility work 2x per week",
        ]
    elif category == "Overweight":
        return [
            "Reduce calorie intake by 300–500 kcal/day",
            "Increase protein intake to preserve muscle",
            "Reduce refined carbs and sugar",
            "Walk 10,000+ steps daily",
            "Combine cardio + strength training",
        ]
    else:
        return [
            "Create a 500 kcal/day calorie deficit",
            "Eliminate ultra-processed foods",
            "Prioritize vegetables and lean protein",
            "Start with low-impact cardio (walking, cycling)",
            "Consult a doctor before intense training",
        ]


@router.post("", response_model=BMIResponse)
@limiter.limit("20/minute")
async def calculate_bmi(request: Request, payload: BMIRequest):
    height_m = payload.height_cm / 100
    bmi = round(payload.weight_kg / (height_m ** 2), 1)
    category = get_bmi_category(bmi)

    bmr = calculate_bmr(payload.weight_kg, payload.height_cm, payload.gender)
    multiplier = ACTIVITY_MULTIPLIERS[payload.activity_level]
    tdee = round(bmr * multiplier)

    protein = round(payload.weight_kg * 1.8)
    carbs_min = round((tdee * 0.40) / 4)
    carbs_max = round((tdee * 0.50) / 4)
    fats_min = round((tdee * 0.20) / 9)
    fats_max = round((tdee * 0.30) / 9)

    return BMIResponse(
        bmi_value=bmi,
        category=category,
        calorie_estimate=tdee,
        protein_grams=protein,
        carbs_range=f"{carbs_min}–{carbs_max}g",
        fats_range=f"{fats_min}–{fats_max}g",
        recommendations=get_recommendations(bmi, category),
    )

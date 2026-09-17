from pydantic import BaseModel, field_validator, Field

def CreateServiceRequest(BaseModel):
    title: str = Field(..., max_length=50)
    description: str = Field(..., max_length=250)
    duration_minutes: int 
    price: int
    
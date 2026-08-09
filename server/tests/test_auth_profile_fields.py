def test_register_response_includes_district_and_created_at(client):
    res = client.post(
        "/api/auth/register",
        json={
            "email": "profile-fields@test.com",
            "password": "password123",
            "name": "Profile Fields Buyer",
            "phone": "+256700111222",
            "role": "buyer",
            "district": "Jinja",
        },
    )
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["district"] == "Jinja"
    assert body["created_at"]


def test_login_response_includes_district_and_created_at(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "profile-fields-login@test.com",
            "password": "password123",
            "name": "Login Buyer",
            "phone": "+256700333444",
            "role": "buyer",
            "district": "Mbale",
        },
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "profile-fields-login@test.com", "password": "password123"},
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["district"] == "Mbale"
    assert body["created_at"]


def test_register_response_district_defaults_to_none_when_omitted(client):
    res = client.post(
        "/api/auth/register",
        json={
            "email": "no-district@test.com",
            "password": "password123",
            "name": "No District Seller",
            "phone": "+256700555666",
            "role": "seller",
            "farm_name": "Test Farm 2",
        },
    )
    assert res.status_code == 201, res.text
    assert res.json()["district"] is None

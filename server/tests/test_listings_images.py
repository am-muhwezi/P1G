import uuid

from app.database import SessionLocal
from app.models.listing import Listing


def make_listing(overrides=None):
    payload = {
        "title": "Large White Boar",
        "description": "Healthy breeding boar",
        "category": "live_pigs",
        "price": 1200000,
        "stock": 2,
        "unit": "pig",
        "district": "Masaka",
    }
    if overrides:
        payload.update(overrides)
    return payload


def test_create_listing_with_images_persists_primary_image(client, auth_headers):
    payload = make_listing(
        {
            "images": [
                "https://supabase.example/listing-1.jpg",
                "https://supabase.example/listing-2.jpg",
            ]
        }
    )
    res = client.post("/api/seller/listings", json=payload, headers=auth_headers)
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["images"] == payload["images"]
    assert body["image"] == payload["images"][0]


def test_create_listing_with_single_image_keeps_images_empty(client, auth_headers):
    payload = make_listing({"image": "https://supabase.example/single.jpg"})
    res = client.post("/api/seller/listings", json=payload, headers=auth_headers)
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["image"] == "https://supabase.example/single.jpg"
    assert body["images"] == []


def test_create_listing_without_images_has_empty_fields(client, auth_headers):
    res = client.post("/api/seller/listings", json=make_listing(), headers=auth_headers)
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["image"] == ""
    assert body["images"] == []


def test_update_images_replaces_and_derives_primary(client, auth_headers):
    created = client.post("/api/seller/listings", json=make_listing(), headers=auth_headers).json()
    res = client.put(
        f"/api/seller/listings/{created['id']}",
        json={
            "images": [
                "https://supabase.example/new-1.jpg",
                "https://supabase.example/new-2.jpg",
            ]
        },
        headers=auth_headers,
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["images"] == [
        "https://supabase.example/new-1.jpg",
        "https://supabase.example/new-2.jpg",
    ]
    assert body["image"] == "https://supabase.example/new-1.jpg"


def test_update_images_to_empty_clears_primary(client, auth_headers):
    created = client.post(
        "/api/seller/listings",
        json=make_listing({"image": "https://supabase.example/old.jpg"}),
        headers=auth_headers,
    ).json()
    res = client.put(
        f"/api/seller/listings/{created['id']}",
        json={"images": []},
        headers=auth_headers,
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["images"] == []
    assert body["image"] == ""


def test_update_image_alone_leaves_images_untouched(client, auth_headers):
    created = client.post(
        "/api/seller/listings",
        json=make_listing({"image": "https://supabase.example/first.jpg"}),
        headers=auth_headers,
    ).json()
    res = client.put(
        f"/api/seller/listings/{created['id']}",
        json={"image": "https://supabase.example/replaced.jpg"},
        headers=auth_headers,
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["image"] == "https://supabase.example/replaced.jpg"


def test_listing_image_fields_flow_to_buyer(client, auth_headers):
    created = client.post(
        "/api/seller/listings",
        json=make_listing(
            {
                "images": [
                    "https://supabase.example/a.jpg",
                    "https://supabase.example/b.jpg",
                ]
            }
        ),
        headers=auth_headers,
    ).json()
    res = client.get(f"/api/listings/{created['id']}")
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["images"] == [
        "https://supabase.example/a.jpg",
        "https://supabase.example/b.jpg",
    ]
    assert body["image"] == "https://supabase.example/a.jpg"


def test_legacy_listing_with_null_images_serializes(client):
    db = SessionLocal()
    try:
        listing = Listing(
            id=str(uuid.uuid4()),
            seller_id="legacy-seller",
            seller_name="Legacy Farm",
            title="Old Listing",
            category="live_pigs",
            price=500000,
            stock=1,
            unit="pig",
            image="https://supabase.example/legacy.jpg",
            images=None,
        )
        db.add(listing)
        db.commit()
        listing_id = listing.id
    finally:
        db.close()
    res = client.get(f"/api/listings/{listing_id}")
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["images"] == []
    assert body["image"] == "https://supabase.example/legacy.jpg"

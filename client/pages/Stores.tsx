import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { userAtom, isAdminAtom } from "../store";
import { useStores } from "../hooks/useStores";
import { useRatings } from "../hooks/useRatings";
import { Role } from "../types";
import { Button, Input, StarRating, Badge } from "../components/UI";
import { Modal, ModalForm } from "../components/Modal";

export const Stores: React.FC = () => {
  const user = useAtomValue(userAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const { stores, isLoading, createStore, refetch } = useStores();
  const { createRating, updateRating } = useRatings();

  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    description: "",
  });

  const [ratingModal, setRatingModal] = useState<{
    open: boolean;
    storeId: string | null;
    currentRating?: any;
  }>({ open: false, storeId: null });
  const [ratingForm, setRatingForm] = useState({ rating: 5 });

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStore(newStore);
      setIsModalOpen(false);
      setNewStore({ name: "", address: "", description: "" });
    } catch (e) {
      alert("Failed to create store");
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModal.storeId) return;

    try {
      if (ratingModal.currentRating) {
        await updateRating(ratingModal.currentRating.id, ratingForm);
      } else {
        await createRating({ ...ratingForm, storeId: ratingModal.storeId });
      }
      setRatingModal({ open: false, storeId: null });
      await refetch();
    } catch (e) {
      alert("Failed to submit rating");
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.address.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Stores</h1>
          <p className="text-primary-500">Browse and rate registered stores.</p>
        </div>
        {(isAdmin || user?.role === Role.ADMIN || user?.role === Role.OWNER) && (
          <Button onClick={() => setIsModalOpen(true)}>+ Add New Store</Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          label="Search"
          placeholder="Search by name or address..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-primary-400">
          Loading stores...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-primary-200 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-primary-900">
                  {store.name}
                </h3>
                <Badge
                  color={
                    store.averageRating && store.averageRating >= 4
                      ? "green"
                      : "blue"
                  }
                >
                  ★{" "}
                  {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                </Badge>
              </div>
              <p className="text-sm text-primary-500 mb-4 flex-grow">
                {store.address}
              </p>

              {store.description && (
                <p className="text-sm text-primary-600 mb-4 line-clamp-2">
                  {store.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-primary-100 flex items-center justify-between">
                {user?.role === Role.USER && (
                  <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={() => {
                      setRatingForm({ rating: 5 });
                      setRatingModal({ open: true, storeId: store.id });
                    }}
                  >
                    {store.myRating ? "Edit Rating" : "Rate Store"}
                  </Button>
                )}
                {user?.role !== Role.USER && (
                  <span className="text-xs text-primary-400 italic">
                    View only
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Store"
      >
        <ModalForm
          onSubmit={handleCreateStore}
          onCancel={() => setIsModalOpen(false)}
          submitLabel="Create"
        >
          <Input
            label="Name"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            required
          />
          <Input
            label="Address"
            value={newStore.address}
            onChange={(e) =>
              setNewStore({ ...newStore, address: e.target.value })
            }
            required
          />
          <Input
            label="Description"
            value={newStore.description}
            onChange={(e) =>
              setNewStore({ ...newStore, description: e.target.value })
            }
          />
        </ModalForm>
      </Modal>

      <Modal
        isOpen={ratingModal.open}
        onClose={() => setRatingModal({ open: false, storeId: null })}
        title="Rate Store"
      >
        <ModalForm
          onSubmit={handleSubmitRating}
          onCancel={() => setRatingModal({ open: false, storeId: null })}
          submitLabel="Submit"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-primary-600">
              Rating
            </label>
            <StarRating
              rating={ratingForm.rating}
              onChange={(r) => setRatingForm({ ...ratingForm, rating: r })}
            />
          </div>
        </ModalForm>
      </Modal>
    </div>
  );
};

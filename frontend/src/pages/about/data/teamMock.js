const teamImages = import.meta.glob(
  '../../../assets/images/team/member-*.webp.png',
  {
    eager: true,
    import: 'default',
  },
)

export const teamMock = Array.from(
  { length: 12 },
  (_, index) => {
    const number = index + 1

    return {
      id: `member${number}`,
      name: `Team Member ${number}`,
      specialty: 'Specialty',
      image:
        teamImages[
          `../../../assets/images/team/member-${number}.webp.png`
        ],
    }
  },
)